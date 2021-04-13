import { Component, HostListener } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { UserIdleService } from 'angular-user-idle'
import { Subject } from 'rxjs'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { AccountService } from '../../../shared/services/account.service'
import { SnackbarService } from '../../../shared/services/snackbar.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './login-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class LoginFormComponent {

    //#region variables

    private feature = 'loginForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/'
    private windowTitle = 'Login'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public hidePassword = true

    //#endregion

    constructor(private accountService: AccountService, private buttonClickService: ButtonClickService, private deviceDetectorService: DeviceDetectorService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private userIdleService: UserIdleService) { }

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.positionImage()
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
    }

    ngAfterViewInit(): void {
        this.positionImage()
        this.focus('username')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public isFakeMobile(): boolean {
        return this.helperService.deviceDetector() == 'mobile'
    }

    public isMobile(): boolean {
        return this.deviceDetectorService.getDeviceInfo().deviceType == 'mobile'
    }

    public onForgotPassword(): void {
        this.router.navigate(['/account/forgotPassword'])
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onLogin(): void {
        const form = this.form.value
        this.accountService.login(form.username, form.password).subscribe(() => {
            this.goHome()
            this.startTimer()
        }, error => {
            this.showError(error)
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
            priority: 1,
            inputs: true
        })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private goHome(): void {
        this.router.navigate([this.url])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            username: [environment.login.username, Validators.required],
            password: [environment.login.password, Validators.required],
            isHuman: [environment.login.isHuman, Validators.requiredTrue]
        })
    }

    private isSidebarVisible(dimension: string): number {
        if (document.getElementById('side-bar') != null) {
            if (dimension == 'width') {
                return document.getElementById('side-bar').clientWidth
            } else {
                return document.getElementById('side-bar').clientHeight
            }
        }
        return 0
    }

    private positionImage(): void {
        const width = this.isSidebarVisible('width') + (document.getElementById('content').clientWidth / 2) - 8
        const height = (document.getElementById('content').clientHeight / 2) + (document.getElementById('top-bar').clientHeight) - document.getElementById('bottom').clientHeight
        document.getElementById('image').style.left = width - 150 + 'px'
        document.getElementById('image').style.top = height - 150 + 'px'
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showError(error: any): void {
        switch (error.status) {
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

    private startTimer(): void {
        this.userIdleService.startWatching()
        this.userIdleService.onTimerStart().subscribe()
        this.userIdleService.onTimeout().subscribe(() => {
            this.userIdleService.resetTimer()
            this.accountService.logout()
            this.userIdleService.stopWatching()
        })
    }

    //#endregion

    //#region getters

    get username(): AbstractControl {
        return this.form.get('username')
    }

    get password(): AbstractControl {
        return this.form.get('password')
    }

    //#endregion

}
