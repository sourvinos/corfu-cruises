import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { KeyboardShortcuts, Unlisten } from '../../../shared/services/keyboard-shortcuts.service'
import { UserService } from '../classes/user.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { environment } from 'src/environments/environment'
import { User } from 'src/app/features/account/classes/user'

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

    private isAdmin: boolean

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService) {
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

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getRecord(id: string): void {
        this.userService.getSingle(id).subscribe(result => {
            this.populateFields(result)
            this.updateUserRole()
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private updateUserRole(): void {
        this.isAdmin = this.form.value.isAdmin
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: '',
            userName: ['', [Validators.required, Validators.maxLength(32)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
            isAdmin: false,
            isActive: true,
            oneTimePassword: [''],
            language: [''],
        })
    }

    private populateFields(result: User): void {
        this.form.setValue({
            id: result.id,
            userName: result.userName,
            displayName: result.displayName,
            email: result.email,
            isAdmin: result.isAdmin,
            isActive: result.isActive,
            oneTimePassword: result.oneTimePassword,
            language: this.helperService.readItem('language'),
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

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get isFirstLogin(): boolean {
        return this.form.value.oneTimePassword
    }

    get isLoggedInUserAdmin(): boolean {
        if (this.isAdmin == null) {
            this.userService.getSingle(this.helperService.readItem('userId')).subscribe(result => {
                this.isAdmin = result.isAdmin
            })
        }
        return this.isAdmin
    }

    //#endregion

}
