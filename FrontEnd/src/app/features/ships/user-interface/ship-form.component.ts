import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ShipOwnerDropdownVM } from '../../shipOwners/classes/view-models/shipOwner-dropdown-vm'
import { ShipReadDto } from '../classes/dtos/ship-read-dto'
import { ShipService } from '../classes/services/ship.service'
import { ShipWriteDto } from '../classes/dtos/ship-write-dto'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'ship-form',
    templateUrl: './ship-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css']
})

export class ShipFormComponent {

    //#region variables 

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'shipForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/ships'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public filteredShipOwners: Observable<ShipOwnerDropdownVM[]>
    public shipOwners: ShipOwnerDropdownVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private shipService: ShipService) {
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
        this.focusOnField('description')
        this.populateDropdowns()
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
                this.shipService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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
            return this[array].filter((element: { [x: string]: string; }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ShipWriteDto {
        const ship = {
            id: this.form.value.id,
            shipOwnerId: this.form.value.shipOwner.id,
            description: this.form.value.description,
            imo: this.form.value.imo,
            flag: this.form.value.flag,
            registryNo: this.form.value.registryNo,
            manager: this.form.value.manager,
            managerInGreece: this.form.value.managerInGreece,
            agent: this.form.value.agent,
            isActive: this.form.value.isActive
        }
        return ship
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(id: number): void {
        this.shipService.getSingle(id).subscribe({
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
            description: ['', [Validators.required, Validators.maxLength(128)]],
            shipOwner: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            imo: ['', [Validators.maxLength(128)]],
            flag: ['', [Validators.maxLength(128)]],
            registryNo: ['', [Validators.maxLength(128)]],
            manager: ['', [Validators.maxLength(128)]],
            managerInGreece: ['', [Validators.maxLength(128)]],
            agent: ['', [Validators.maxLength(128)]],
            isActive: true
        })
    }

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('shipOwners', 'filteredShipOwners', 'shipOwner', 'description')
    }

    private populateFields(result: ShipReadDto): void {
        this.form.setValue({
            id: result.id,
            shipOwner: { 'id': result.shipOwner.id, 'description': result.shipOwner.description },
            description: result.description,
            imo: result.imo,
            flag: result.flag,
            registryNo: result.registryNo,
            manager: result.manager,
            managerInGreece: result.managerInGreece,
            agent: result.agent,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(ship: ShipWriteDto): void {
        if (ship.id === 0) {
            this.shipService.add(ship).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        } else {
            this.shipService.update(ship.id, ship).pipe(indicate(this.isLoading)).subscribe({
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

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get shipOwner(): AbstractControl {
        return this.form.get('shipOwner')
    }

    get imo(): AbstractControl {
        return this.form.get('imo')
    }

    get flag(): AbstractControl {
        return this.form.get('flag')
    }

    get manager(): AbstractControl {
        return this.form.get('manager')
    }

    get managerInGreece(): AbstractControl {
        return this.form.get('managerInGreece')
    }

    get agent(): AbstractControl {
        return this.form.get('agent')
    }

    get registryNo(): AbstractControl {
        return this.form.get('registryNo')
    }

    get isActive(): AbstractControl {
        return this.form.get('isActive')
    }

    //#endregion

}
