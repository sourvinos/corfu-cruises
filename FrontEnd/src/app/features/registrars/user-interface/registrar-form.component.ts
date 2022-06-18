import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { RegistrarReadVM } from '../classes/view-models/registrar-read-vm'
import { RegistrarService } from '../classes/services/registrar.service'
import { RegistrarWriteVM } from '../classes/view-models/registrar-write-vm'
import { ShipDropdownVM } from '../../ships/classes/view-models/ship-dropdown-vm'
import { ShipService } from '../../ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { map, startWith } from 'rxjs/operators'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'registrar-form',
    templateUrl: './registrar-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class RegistrarFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'registrarForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/registrars'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public ships: ShipDropdownVM[] = []
    public filteredShips: Observable<ShipDropdownVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private registrarService: RegistrarService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.getRecord(x.id) : null
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.warning(), this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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
        this.dialogService.open(this.messageSnackbarService.warning(), this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.registrarService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.resetForm()
                        this.goBack()
                        this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    },
                    error: (errorFromInterceptor) => {
                        this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
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

    private flattenForm(): RegistrarWriteVM {
        const registrar = {
            id: this.form.value.id,
            shipId: this.form.value.ship.id,
            fullname: this.form.value.fullname,
            phones: this.form.value.phones,
            email: this.form.value.email,
            fax: this.form.value.fax,
            address: this.form.value.address,
            isPrimary: this.form.value.isPrimary,
            isActive: this.form.value.isActive
        }
        return registrar
    }

    private getRecord(id: number): Promise<any> {
        const promise = new Promise((resolve) => {
            this.registrarService.getSingle(id).subscribe(result => {
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
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            fullname: ['', [Validators.required, Validators.maxLength(128)]],
            phones: ['', Validators.maxLength(128)],
            email: ['', [Validators.maxLength(128), Validators.email]],
            fax: ['', Validators.maxLength(128)],
            address: ['', Validators.maxLength(128)],
            isPrimary: true,
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string, addWildCard = false): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any[]) => {
                    if (addWildCard)
                        response.unshift({ id: null, description: this.emojiService.getEmoji('wildcard') })
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.shipService, 'ships', 'filteredShips', 'ship', 'description')
    }

    private populateFields(result: RegistrarReadVM): void {
        this.form.setValue({
            id: result.id,
            fullname: result.fullname,
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            phones: result.phones,
            email: result.email,
            fax: result.fax,
            address: result.address,
            isPrimary: result.isPrimary,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(registrar: RegistrarWriteVM): void {
        if (registrar.id === 0) {
            this.registrarService.add(registrar).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
                },
                error: (errorFromInterceptor) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                }
            })
        } else {
            this.registrarService.update(registrar.id, registrar).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                },
                error: (errorFromInterceptor) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                }
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

    get fullname(): AbstractControl {
        return this.form.get('fullname')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get phones(): AbstractControl {
        return this.form.get('phones')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get fax(): AbstractControl {
        return this.form.get('fax')
    }

    get address(): AbstractControl {
        return this.form.get('address')
    }

    //#endregion

}
