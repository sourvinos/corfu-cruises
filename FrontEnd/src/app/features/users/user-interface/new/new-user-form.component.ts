import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { ConfirmValidParentMatcher, ValidationService } from '../../../../shared/services/validation.service'
import { CustomerDropdownVM } from '../../../customers/classes/view-models/customer-dropdown-vm'
import { CustomerService } from '../../../customers/classes/services/customer.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../../shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserNewDTO } from '../../classes/dtos/new-user-dto'
import { UserService } from '../../classes/services/user.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'new-user-form',
    templateUrl: './new-user-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './new-user-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class NewUserFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'newUserForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/users'

    public isAutoCompleteDisabled = true
    public customers: CustomerDropdownVM[] = []
    public filteredCustomers: Observable<CustomerDropdownVM[]>

    public confirmValidParentMatcher = new ConfirmValidParentMatcher()
    public hidePassword = true

    //#endregion

    constructor(private accountService: AccountService, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService) { }

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

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    public onSendLoginCredentials(): void {
        this.flattenForm()
        this.userService.sendLoginCredentials(this.form).subscribe({
            complete: () => {
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            },
            error: (errorFromInterceptor) => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            }
        })
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

    private flattenForm(): UserNewDTO {
        const user = {
            userName: this.form.value.userName,
            displayname: this.form.value.displayname,
            customerId: this.form.value.customer.id == 'null' ? null : this.form.value.customer.id,
            email: this.form.value.email,
            password: this.form.value.passwords.password,
            confirmPassword: this.form.value.passwords.confirmPassword,
            isAdmin: this.form.value.isAdmin,
            isActive: this.form.value.isActive
        }
        return user
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.maxLength(32), ValidationService.containsSpace]],
            displayname: ['', [Validators.required, Validators.maxLength(32)]],
            customer: ['', ValidationService.RequireAutocomplete],
            email: ['', [Validators.required, Validators.maxLength(128), Validators.email]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
                confirmPassword: ['', [Validators.required, ValidationService.containsSpace]]
            }, { validator: ValidationService.childrenEqual }),
            isAdmin: false,
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    this[table].unshift({ 'id': 'null', 'description': '[⭐]' })
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description')
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(user: UserNewDTO): void {
        this.accountService.register(user).subscribe({
            complete: () => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            },
            error: (errorFromInterceptor) => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            }
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string | string[], type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get userName(): AbstractControl {
        return this.form.get('userName')
    }

    get displayname(): AbstractControl {
        return this.form.get('displayname')
    }

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get passwords(): AbstractControl {
        return this.form.get('passwords')
    }

    get password(): AbstractControl {
        return this.form.get('passwords.password')
    }

    get confirmPassword(): AbstractControl {
        return this.form.get('passwords.confirmPassword')
    }

    get matchingPasswords(): boolean {
        return this.form.get('passwords.password').value === this.form.get('passwords.confirmPassword').value
    }

    //#endregion

}
