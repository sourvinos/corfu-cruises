import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownResource } from '../../reservations/classes/resources/form/dropdown/customer-dropdown-resource'
import { CustomerService } from '../../customers/classes/services/customer.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { User } from 'src/app/features/account/classes/user'
import { UserService } from '../classes/user.service'
import { ValidationService } from './../../../shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'edit-user-form',
    templateUrl: './edit-user-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EditUserFormComponent {

    //#region variables

    private feature = 'editUserForm'
    private flatForm: FormGroup
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private userId: string
    private windowTitle = 'User'
    public filteredCustomers: Observable<CustomerDropdownResource[]>
    public form: FormGroup
    public input: InputTabStopDirective
    public isAdmin: boolean
    public returnUrl: string

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.editUserFromList(x) : this.editUserFromTopMenu()
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.initForm()
        this.getReturnUrl()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.warning(),'warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.onGoBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    //#endregion

    //#region public methods

    public autocompleteCustomer(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onChangePassword(): void {
        if (this.form.dirty) {
            this.showSnackbar(this.messageSnackbarService.formIsDirty(), 'error')
        } else {
            this.router.navigate(['/users/' + this.form.value.id + '/changePassword'])
        }
    }

    public onGoBack(): void {
        this.router.navigate([this.returnUrl])
    }

    public onSave(): void {
        this.flattenForm()
        this.userService.update(this.flatForm.value.id, this.flatForm.value).subscribe(() => {
            this.resetForm()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            this.onGoBack()
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
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
            priority: 1,
            inputs: true
        })
    }

    private editUserFromList(x: { [x: string]: any; id?: any }) {
        this.getConnectedUserRole().then(() => {
            this.getRecord(x.id).then(() => {
                this.populateDropDowns()
            })
        })
    }

    private editUserFromTopMenu() {
        this.getConnectedUserRole().then(() => new Promise(() => {
            this.getUserId().then(() => {
                this.getRecord(this.userId).then(() => {
                    this.populateDropDowns()
                })
            })
        }))
    }

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): void {
        this.flatForm = this.formBuilder.group({
            id: this.form.getRawValue().id,
            userName: this.form.getRawValue().userName,
            displayName: this.form.getRawValue().displayName,
            customerId: this.form.getRawValue().customer.id,
            email: this.form.getRawValue().email,
            isAdmin: this.form.getRawValue().isAdmin,
            isActive: this.form.getRawValue().isActive
        })
    }

    private getRecord(userId: string): Promise<any> {
        const promise = new Promise((resolve) => {
            this.userService.getSingle(userId).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                this.onGoBack()
            })
        })
        return promise
    }

    private getUserId(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.accountService.getConnectedUserId().toPromise().then(
                (response) => {
                    this.userId = response.userId
                    resolve(this.userId)
                })
        })
        return promise
    }

    private getConnectedUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.accountService.isConnectedUserAdmin().toPromise().then(
                (response) => {
                    this.isAdmin = response
                    resolve(this.isAdmin)
                })
        })
        return promise
    }

    private getReturnUrl(): void {
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl']
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: '',
            userName: ['', [Validators.required, Validators.maxLength(32)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            email: [{ value: '' }, [Validators.required, Validators.email, Validators.maxLength(128)]],
            isAdmin: [{ value: false }],
            isActive: [{ value: true }]
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
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description', true)
    }

    private populateFields(result: User): void {
        this.form.setValue({
            id: result.id,
            userName: result.userName,
            displayName: result.displayName,
            customer: { 'id': result.customer.id, 'description': result.customer.id == 0 ? this.emojiService.getEmoji('wildcard') : result.customer.description },
            email: result.email,
            isAdmin: result.isAdmin,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get userName(): AbstractControl {
        return this.form.get('userName')
    }

    get displayname(): AbstractControl {
        return this.form.get('displayName')
    }

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    //#endregion

}
