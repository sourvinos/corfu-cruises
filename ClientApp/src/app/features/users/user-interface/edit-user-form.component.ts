import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { forkJoin, Observable, Subject, Subscription } from 'rxjs'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Customer } from '../../customers/classes/customer'
import { CustomerService } from '../../customers/classes/customer.service'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../shared/services/keyboard-shortcuts.service'
import { MatDialog } from '@angular/material/dialog'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { User } from 'src/app/features/account/classes/user'
import { UserService } from '../classes/user.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { AccountService } from 'src/app/shared/services/account.service'

@Component({
    selector: 'edit-user-form',
    templateUrl: './edit-user-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EditUserFormComponent {

    //#region variables

    private feature = 'editUserForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/users'
    private windowTitle = 'User'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public customers: any
    private userRole: Observable<string>

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.updateVariables()
    }

    ngAfterViewInit(): void {
        this.focus('userName')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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

    public onChangePassword(): void {
        if (this.form.dirty) {
            this.showSnackbar(this.messageSnackbarService.formIsDirty(), 'error')
        } else {
            this.router.navigate(['/users/' + this.form.value.id + '/changePassword'])
        }
    }

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['ok', 'abort']).subscribe(response => {
            if (response) {
                this.userService.delete(this.form.value.id).subscribe(() => {
                    this.resetForm()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetEditUserCaller(): string {
        return this.helperService.readItem('editUserCaller')
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(this.helperService.readItem('editUserCaller') == 'list' ? [this.url] : ['/'])
    }

    public onLookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[], value: { target: any }): void {
        let filteredArray = []
        lookupArray.filter(x => {
            filteredArray = this.helperService.pushItemToFilteredArray(x, fields[1], value, filteredArray)
        })
        if (filteredArray.length === 0) {
            this.clearFields(null, formFields[0], formFields[1])
        }
        if (filteredArray.length === 1) {
            const [...elements] = filteredArray
            this.patchFields(elements[0], fields)
        }
        if (filteredArray.length > 1) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify, types)
        }
    }

    public onSave(): void {
        this.userService.update(this.form.value.id, this.form.value).subscribe(() => {
            this.resetForm()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            this.onGoBack()
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
        })
    }

    public onSendFirstLoginCredentials(): void {
        this.userService.sendFirstLoginCredentials(this.form.value).subscribe(() => {
            this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
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
            'Alt.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'abort')
                } else {
                    this.buttonClickService.clickOnButton(event, 'changePassword')
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'save')
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'ok')
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private clearFields(result: any, id: any, description: any): void {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getCustomer(id: number): Promise<Customer> {
        return this.customerService.getSingle(id).toPromise()
    }

    private getRecord(id: string): void {
        this.userService.getSingle(id).subscribe(result => {
            this.getCustomer(result.customerId).then((customer) => {
                this.populateFields(result, customer)
                this.updateUserRole()
            })
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: '',
            userName: ['', [Validators.required, Validators.maxLength(32)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            customerId: [''], customerDescription: [{ value: '', disabled: !this.isUserAdmin() }, Validators.required],
            email: [{ value: '', disabled: !this.isUserAdmin() }, [Validators.required, Validators.email, Validators.maxLength(128)]],
            isAdmin: false,
            isActive: true,
            oneTimePassword: [''],
            language: [''],
        })
    }

    private isUserAdmin(): boolean {
        let isAdmin = false
        this.accountService.currentUserRole.subscribe(result => {
            isAdmin = result.toLowerCase() == 'admin'
        })
        return isAdmin
    }

    private patchFields(result: any, fields: any[]): void {
        2
        if (result) {
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        } else {
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
        }
    }

    private populateDropDowns(): Subscription {
        const sources = []
        sources.push(this.customerService.getAllActive())
        return forkJoin(sources).subscribe(
            result => {
                this.customers = result[0]
                this.renameObjects()
            }
        )
    }

    private populateFields(result: User, customer: Customer): void {
        this.form.setValue({
            id: result.id,
            userName: result.userName,
            displayName: result.displayName,
            customerId: result.customerId,
            customerDescription: customer.description,
            email: result.email,
            isAdmin: result.isAdmin,
            isActive: result.isActive,
            oneTimePassword: result.oneTimePassword,
            language: this.helperService.readItem('language'),
        })
    }

    private renameKey(obj: any, oldKey: string, newKey: string): void {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects(): void {
        this.customers.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'customerId')
            this.renameKey(obj, 'description', 'customerDescription')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showModalIndex(elements: any, title: string, fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[]): void {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
            data: {
                records: elements,
                title: title,
                fields: fields,
                headers: headers,
                widths: widths,
                visibility: visibility,
                justify: justify,
                types: types,
                highlightFirstRow: true
            }
        })
        dialog.afterClosed().subscribe((result) => {
            this.patchFields(result, fields)
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updateVariables(): void {
        this.userRole = this.accountService.currentUserRole
    }

    private updateUserRole(): void {
        this.isUserAdmin = this.form.value.isAdmin
    }

    //#endregion

    //#region getters

    get userName(): AbstractControl {
        return this.form.get('userName')
    }

    get displayname(): AbstractControl {
        return this.form.get('displayName')
    }

    get customerDescription(): AbstractControl {
        return this.form.get('customerDescription')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get isFirstLogin(): boolean {
        return this.form.value.oneTimePassword
    }

    get isConnectedUserAdmin(): boolean {
        let isAdmin = false
        this.userRole.subscribe(result => {
            isAdmin = result == 'Admin' ? true : false
        })
        return isAdmin
    }

    //#endregion

}
