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
import { CustomerService } from '../../customers/classes/customer.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from '../../../shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { User } from 'src/app/features/account/classes/user'
import { UserService } from '../classes/user.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { environment } from 'src/environments/environment'
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
    private url = '/users'
    private windowTitle = 'User'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public customers: any
    public filteredCustomers: Observable<CustomerDropdownResource[]>

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService) {
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

    public onCustomerFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
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

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate([this.activatedRoute.snapshot.queryParams['returnUrl']])
    }

    public onMustBeAdmin(): boolean {
        return this.isAdmin()
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

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): void {
        this.flatForm = this.formBuilder.group({
            id: this.form.value.id,
            userName: this.form.value.userName,
            displayName: this.form.value.displayName,
            customerId: this.form.value.customer.id,
            email: this.form.value.email,
            isAdmin: this.form.value.isAdmin,
            isActive: this.form.value.isActive
        })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getRecord(id: string): void {
        this.userService.getSingle(id).subscribe(result => {
            this.populateFields(result)
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
            customer: [{ value: '', disabled: !this.isAdmin() }, [Validators.required, ValidationService.RequireAutocomplete]],
            email: [{ value: '', disabled: !this.isAdmin() }, [Validators.required, Validators.email, Validators.maxLength(128)]],
            isAdmin: [{ value: false, disabled: !this.isAdmin() }],
            isActive: [{ value: true, disabled: !this.isAdmin() }]
        })
    }

    private isAdmin(): boolean {
        let isAdmin = false
        this.accountService.currentUserRole.subscribe(result => {
            isAdmin = result.toLowerCase() == 'admin'
        })
        return isAdmin
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getAllActive().toPromise().then(
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

    private populateDropDowns(): void {
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description')
    }

    private populateFields(result: User): void {
        this.form.setValue({
            id: result.id,
            userName: result.userName,
            displayName: result.displayName,
            customer: { "id": result.customerId, "description": result.customerDescription },
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
