import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CoachRouteDropdownVM } from '../../coachRoutes/classes/view-models/coachRoute-dropdown-vm'
import { DialogService } from '../../../shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointReadDto } from '../classes/dtos/pickupPoint-read-dto'
import { PickupPointService } from '../classes/services/pickupPoint.service'
import { PickupPointVM } from '../classes/view-models/pickupPoint-vm'
import { PickupPointWriteDto } from '../classes/dtos/pickupPoint-write-dto'
import { ValidationService } from '../../../shared/services/validation.service'

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './pickupPoint-form.component.css']
})

export class PickupPointFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'pickupPointForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/pickupPoints'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public filteredRoutes: Observable<CoachRouteDropdownVM[]>
    public pickupPoints: PickupPointVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private pickupPointService: PickupPointService, private router: Router,) {
        this.activatedRoute.params.subscribe(x => {
            if (x.id) {
                this.initForm()
                this.getRecord(x.id)
            } else {
                this.initForm()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.focusOnField('coachRoute')
        this.populateDropDowns()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.askConfirmationToAbortEditing(), 'warning', ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    //#endregion

    //#region public methods

    public autocompleteFields(subject: { abbreviation: any }): any {
        return subject ? subject.abbreviation : undefined
    }

    public checkForEmptyAutoComplete(event: { target: { value: any } }) {
        if (event.target.value == '') this.isAutoCompleteDisabled = true
    }

    public enableOrDisableAutoComplete(event: any) {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.pickupPointService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                    },
                    error: (errorFromInterceptor) => {
                        this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
                    }
                })
            }
        })
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'save')
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): PickupPointWriteDto {
        const pickupPoint = {
            id: this.form.value.id,
            coachRouteId: this.form.value.coachRoute.id,
            description: this.form.value.description,
            exactPoint: this.form.value.exactPoint,
            time: this.form.value.time,
            coordinates: this.form.value.coordinates,
            isActive: this.form.value.isActive
        }
        return pickupPoint
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(id: number): void {
        this.pickupPointService.getSingle(id).subscribe({
            next: (response) => {
                this.populateFields(response)
            },
            error: (errorFromInterceptor) => {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
            }
        })
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            coachRoute: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            exactPoint: ['', [Validators.required, Validators.maxLength(128)]],
            time: ['', [Validators.required, ValidationService.isTime]],
            coordinates: ['00.00000000000000,00.000000000000000', [Validators.required]],
            isActive: true
        })
    }

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        this.populateDropdownFromLocalStorage('coachRoutes', 'filteredRoutes', 'coachRoute', 'abbreviation')
    }

    private populateFields(result: PickupPointReadDto): void {
        this.form.setValue({
            id: result.id,
            coachRoute: { 'id': result.coachRoute.id, 'abbreviation': result.coachRoute.abbreviation },
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
            coordinates: result.coordinates,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(pickupPoint: PickupPointWriteDto): void {
        if (pickupPoint.id === 0) {
            this.pickupPointService.add(pickupPoint).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        } else {
            this.pickupPointService.update(pickupPoint.id, pickupPoint).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        }
    }

    //#endregion

    //#region getters

    get coachRoute(): AbstractControl {
        return this.form.get('coachRoute')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get exactPoint(): AbstractControl {
        return this.form.get('exactPoint')
    }

    get time(): AbstractControl {
        return this.form.get('time')
    }

    get coordinates(): AbstractControl {
        return this.form.get('coordinates')
    }

    //#endregion

}
