import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownVM } from '../../../customers/classes/view-models/customer-dropdown-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EditUserViewModel } from './../../classes/view-models/edit-user-view-model'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../../shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { UpdateUserDto } from '../../classes/dtos/update-user-dto'
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
    public icon = ''
    public input: InputTabStopDirective
    public parentUrl = ''
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public customers: CustomerDropdownVM[] = []
    public filteredCustomers: Observable<CustomerDropdownVM[]>

    private user: EditUserViewModel
    public header = ''
    public isAdmin: boolean

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private userService: UserService) {
        this.initForm()
        this.getRecord().then(() => {
            this.populateFields(this.user)
            this.updateReturnUrl()
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.focusOnField('userName')
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

    public changePassword(): void {
        // this.accountService.getConnectedUserId().subscribe(response => {
        //     if (response.userId != this.form.value.id) {
        //         this.dialogService.open(this.messageSnackbarService.passwordCanBeChangedOnlyByAccountOwner(), 'error', ['ok'])
        //     } else {
        //         if (this.form.dirty) {
        //             this.dialogService.open(this.messageSnackbarService.formIsDirty(), 'warning', ['abort', 'ok']).subscribe(response => {
        //                 if (response) {
        //                     this.onSave(false).then(() => {
        //                         this.resetForm()
        //                         this.router.navigate(['/users/' + this.user.id + '/changePassword'])
        //                     })
        //                 }
        //             })
        //         } else {
        //             this.router.navigate(['/users/' + this.user.id + '/changePassword'])
        //         }
        //     }
        // })
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
                this.userService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    public onSave(showResult: boolean): Promise<any> {
        const promise = new Promise((resolve) => {
            this.saveRecord(this.flattenForm(), showResult)
            resolve(null)
        })
        return promise
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

    private editUserFromList() {
        this.parentUrl = '/users'
        this.icon = 'arrow_back'
        this.header = 'header'
        this.populateDropDowns()
    }

    private editUserFromTopMenu() {
        this.parentUrl = '/'
        this.icon = 'home'
        this.header = 'my-header'
        this.populateDropDowns()
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

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(): Promise<any> {
        const promise = new Promise((resolve) => {
            const formResolved: FormResolved = this.activatedRoute.snapshot.data['userForm']
            if (formResolved.error === null) {
                this.user = formResolved.record
                resolve(this.user)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    // private getConnectedUserId(): Promise<any> {
    //     const promise = new Promise((resolve) => {
    //         firstValueFrom(this.accountService.getConnectedUserId()).then(
    //             (response) => {
    //                 resolve(response.userId)
    //             })
    //     })
    //     return promise
    // }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: '',
            userName: ['', [Validators.required, Validators.maxLength(32), ValidationService.containsIllegalCharacters]],
            displayname: ['', [Validators.required, Validators.maxLength(32), ValidationService.beginsOrEndsWithSpace]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            email: [{ value: '' }, [Validators.required, Validators.email, Validators.maxLength(128)]],
            isAdmin: [{ value: false }],
            isActive: [{ value: true }]
        })
    }

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string, includeWildCard: boolean) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        includeWildCard ? this[table].unshift({ 'id': 'all', 'description': '[⭐]' }) : null
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        this.populateDropdownFromLocalStorage('customers', 'filteredCustomers', 'customer', 'description', true)
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

    private saveRecord(user: UpdateUserDto, showResult: boolean): void {
        this.userService.update(user.id, user).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                showResult ? this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form) : null
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    private updateReturnUrl(): void {
        this.localStorageService.getItem('returnUrl') == '/' ? this.editUserFromTopMenu() : this.editUserFromList()
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
