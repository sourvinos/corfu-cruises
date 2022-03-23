import idleService, { IdleEvents } from '@kurtz1993/idle-service'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { AccountService } from '../../../shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from '../../../shared/services/snackbar.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './login-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class LoginFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'loginForm'
    public form: FormGroup
    public icon = ''
    public input: InputTabStopDirective
    public parentUrl = null

    public hidePassword = true
    public isProcessing = false

    //#endregion

    constructor(private accountService: AccountService, private buttonClickService: ButtonClickService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) { }

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

    //#endregion

    //#region public methods

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onForgotPassword(): void {
        this.router.navigate(['forgotPassword'])
    }

    public onLogin(): void {
        const form = this.form.value
        this.isProcessing = true
        this.accountService.login(form.username, form.password).subscribe(() => {
            this.goHome()
            this.configureIdle()
            this.isProcessing = false
        }, error => {
            this.showError(error)
            this.isProcessing = false
        })
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Alt.F': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'forgotPassword')
            },
            'Alt.L': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'login')
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

    private configureIdle(): void {
        idleService.configure({
            timeToIdle: 3600,
            timeToTimeout: 60,
            autoResume: true,
            listenFor: 'click mousemove',
        })
        idleService.on(IdleEvents.UserHasTimedOut, () => {
            this.accountService.logout()
        })
        idleService.start()
    }

    private goHome(): void {
        this.router.navigate(['/'])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            username: [environment.login.username, Validators.required],
            password: [environment.login.password, Validators.required],
            isHuman: [environment.login.isHuman, Validators.requiredTrue]
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle())
    }

    private showError(error: any): void {
        switch (error.status) {
            case 0:
                this.showSnackbar(this.messageSnackbarService.noContactWithServer(), 'error')
                break
            case 401:
                this.showSnackbar(this.messageSnackbarService.authenticationFailed(), 'error')
                break
            case 495:
                this.showSnackbar(this.messageSnackbarService.accountNotConfirmed(), 'error')
                break
        }
    }

    private showSnackbar(message: string | string[], type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get username(): AbstractControl {
        return this.form.get('username')
    }

    get password(): AbstractControl {
        return this.form.get('password')
    }

    get checkForProcessing() {
        return this.isProcessing
    }

    //#endregion

}