import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ShipOwnerDropdownVM } from '../../shipOwners/classes/view-models/shipOwner-dropdown-vm'
import { ShipOwnerService } from 'src/app/features/shipOwners/classes/services/shipOwner.service'
import { ShipReadVM } from '../classes/view-models/ship-read-vm'
import { ShipService } from '../classes/services/ship.service'
import { ShipWriteVM } from '../classes/view-models/ship-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { map, startWith } from 'rxjs/operators'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'ship-form',
    templateUrl: './ship-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
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
    public loading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public filteredShipOwners: Observable<ShipOwnerDropdownVM[]>
    public shipOwners: ShipOwnerDropdownVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private shipOwnerService: ShipOwnerService, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.getRecord(x.id) : null
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropdowns()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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
        this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.shipService.delete(this.form.value.id).pipe(indicate(this.loading)).subscribe(() => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
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

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ShipWriteVM {
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

    private getRecord(id: number): Promise<any> {
        const promise = new Promise((resolve) => {
            this.shipService.getSingle(id).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        })
        return promise
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

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.shipOwnerService, 'shipOwners', 'filteredShipOwners', 'shipOwner', 'description')
    }

    private populateFields(result: ShipReadVM): void {
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

    private saveRecord(ship: ShipWriteVM): void {
        if (ship.id === 0) {
            this.shipService.add(ship).pipe(indicate(this.loading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        } else {
            this.shipService.update(ship.id, ship).pipe(indicate(this.loading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
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
