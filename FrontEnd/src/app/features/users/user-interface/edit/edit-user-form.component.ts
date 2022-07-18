import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { firstValueFrom, Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownVM } from '../../../customers/classes/view-models/customer-dropdown-vm'
import { CustomerService } from '../../../customers/classes/services/customer.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { UpdateUserDto } from '../../classes/dtos/update-user-dto'
import { EditUserViewModel } from './../../classes/view-models/edit-user-view-model'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../../shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserService } from '../../classes/services/user.service'
import { ValidationService } from '../../../../shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'edit-user-form',
    templateUrl: './edit-user-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EditUserFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'editUserForm'
    public form: FormGroup
    public icon = null
    public input: InputTabStopDirective
    public parentUrl = null
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public customers: CustomerDropdownVM[] = []
    public filteredCustomers: Observable<CustomerDropdownVM[]>

    public header = ''
    public isAdmin: boolean

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService) {
        this.activatedRoute.params.subscribe((userId) => {
            activatedRoute.queryParams.subscribe(response => {
                response.returnUrl == '/' ? this.editUserFromTopMenu() : this.editUserFromList(userId)
            })
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
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

    public onChangePassword(): void {
        if (this.form.dirty) {
            this.showSnackbar(this.messageSnackbarService.formIsDirty(), 'error')
        } else {
            this.router.navigate(['/users/' + this.form.value.id + '/changePassword'])
        }
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

    private editUserFromList(x: { [x: string]: any; id?: any }) {
        this.getConnectedUserRole().then(() => {
            this.getRecord(x.id).then(() => {
                this.parentUrl = '/users'
                this.icon = 'arrow_back'
                this.header = 'header'
                this.populateDropDowns()
            })
        })
    }

    private editUserFromTopMenu() {
        this.getConnectedUserRole().then(() => new Promise(() => {
            this.getConnectedUserId().then((response) => {
                this.getRecord(response).then(() => {
                    this.parentUrl = '/'
                    this.icon = 'home'
                    this.header = 'my-header'
                    this.populateDropDowns()
                })
            })
        }))
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): UpdateUserDto {
        const user = {
            id: this.form.getRawValue().id,
            userName: this.form.getRawValue().userName,
            displayname: this.form.getRawValue().displayname,
            customerId: this.form.getRawValue().customer.id,
            email: this.form.getRawValue().email,
            isAdmin: this.form.getRawValue().isAdmin,
            isActive: this.form.getRawValue().isActive
        }
        return user
    }

    private getRecord(userId: string): Promise<any> {
        const promise = new Promise((resolve) => {
            this.userService.getSingle(userId).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
            })
        })
        return promise
    }

    private getConnectedUserId(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.getConnectedUserId()).then(
                (response) => {
                    resolve(response.userId)
                })
        })
        return promise
    }

    private getConnectedUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.isConnectedUserAdmin()).then(
                (response) => {
                    this.isAdmin = response
                    resolve(this.isAdmin)
                })
        })
        return promise
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: '',
            userName: ['', [Validators.required, Validators.maxLength(32)]],
            displayname: ['', [Validators.required, Validators.maxLength(32)]],
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
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description', true)
    }

    private populateFields(result: EditUserViewModel): void {
        this.form.setValue({
            id: result.id,
            userName: result.userName,
            displayname: result.displayname,
            customer: { 'id': result.customer.id, 'description': result.customer.id == 0 ? this.emojiService.getEmoji('wildcard') : result.customer.description },
            email: result.email,
            isAdmin: result.isAdmin,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(user: UpdateUserDto): void {
        this.flattenForm()
        this.userService.update(user.id, user).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, error: (errorFromInterceptor) => {
                this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
            }
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
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
        return this.form.get('displayname')
    }

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    //#endregion

}
