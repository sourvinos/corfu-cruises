import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { GenderDropdownVM } from '../../genders/classes/view-models/gender-dropdown-vm'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { NationalityDropdownVM } from '../../nationalities/classes/view-models/nationality-dropdown-vm'
import { ShipCrewReadDto } from '../classes/dtos/shipCrew-read-dto'
import { ShipCrewService } from '../classes/services/shipCrew.service'
import { ShipCrewWriteDto } from '../classes/dtos/shipCrew-write-dto'
import { ShipDropdownVM } from '../../ships/classes/view-models/ship-dropdown-vm'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'ship-crew-form',
    templateUrl: './shipCrew-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ShipCrewFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'crewForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/shipCrews'
    public isLoading = new Subject<boolean>()

    public minBirthDate = new Date(new Date().getFullYear() - 99, 0, 1)
    public maxBirthDate = new Date()

    public isAutoCompleteDisabled = true

    public genders: GenderDropdownVM[] = []
    public filteredGenders: Observable<GenderDropdownVM[]>
    public nationalities: NationalityDropdownVM[] = []
    public filteredNationalities: Observable<NationalityDropdownVM[]>
    public ships: ShipDropdownVM[] = []
    public filteredShips: Observable<ShipDropdownVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private crewService: ShipCrewService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private shipCrewService: ShipCrewService,) {
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
        this.focusOnField('lastname')
        this.populateDropDowns()
        this.subscribeToInteractionService()
        this.setLocale()
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

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
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
                this.crewService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
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

    private flattenForm(): ShipCrewWriteDto {
        const crew = {
            id: this.form.value.id,
            shipId: this.form.value.ship.id,
            genderId: this.form.value.gender.id,
            nationalityId: this.form.value.nationality.id,
            lastname: this.form.value.lastname,
            firstname: this.form.value.firstname,
            birthdate: moment(this.form.value.birthdate).format('YYYY-MM-DD'),
            isActive: this.form.value.isActive
        }
        return crew
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(id: number): void {
        this.crewService.getSingle(id).subscribe({
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
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            isActive: true
        })
    }

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        this.populateDropdownFromLocalStorage('genders', 'filteredGenders', 'gender', 'description')
        this.populateDropdownFromLocalStorage('nationalities', 'filteredNationalities', 'nationality', 'description')
        this.populateDropdownFromLocalStorage('ships', 'filteredShips', 'ship', 'description')
    }

    private populateFields(result: ShipCrewReadDto): void {
        this.form.setValue({
            id: result.id,
            lastname: result.lastname,
            firstname: result.firstname,
            birthdate: result.birthdate,
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            nationality: { 'id': result.nationality.id, 'description': result.nationality.description },
            gender: { 'id': result.gender.id, 'description': result.gender.description },
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(shipCrew: ShipCrewWriteDto): void {
        if (shipCrew.id === 0) {
            this.shipCrewService.add(shipCrew).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        } else {
            this.shipCrewService.update(shipCrew.id, shipCrew).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        }
    }

    private setLocale() {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    get birthdate(): AbstractControl {
        return this.form.get('birthdate')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get nationality(): AbstractControl {
        return this.form.get('nationality')
    }

    get gender(): AbstractControl {
        return this.form.get('gender')
    }

    //#endregion

}
