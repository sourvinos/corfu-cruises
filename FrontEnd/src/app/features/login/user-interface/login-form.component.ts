import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Idle } from '@ng-idle/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { AccountService } from '../../../shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerService } from '../../customers/classes/services/customer.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LocalbaseDataService } from 'src/app/shared/services/localbase-data.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PortService } from '../../ports/classes/services/port.service'
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { DestinationService } from '../../destinations/classes/services/destination.service'
import { DriverService } from '../../drivers/classes/services/driver.service'
import { PickupPointService } from '../../pickupPoints/classes/services/pickupPoint.service'

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

    public countdown = 0
    public hidePassword = true
    public idleState = 'NOT_STARTED'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(
        private accountService: AccountService,
        private buttonClickService: ButtonClickService,
        private destinationService: DestinationService,
        private formBuilder: FormBuilder,
        private helperService: HelperService,
        private portService: PortService,
        private pickupPointService: PickupPointService,
        private idle: Idle,
        private interactionService: InteractionService,
        private keyboardShortcutsService: KeyboardShortcuts,
        private localStorageService: LocalStorageService,
        private messageHintService: MessageHintService,
        private driverService: DriverService,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageSnackbarService,
        private router: Router,
        private sweetAlertService: SweetAlertService,
        private titleService: Title,
        private localbaseDataService: LocalbaseDataService,
        private customerService: CustomerService
    ) { }


    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.clearStoredVariables()
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
        this.accountService.login(this.form.value.username, this.form.value.password).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.goHome()
                this.startIdleTimer()
                this.doSideMenuTogglerTasks()
                this.populateLocalbaseFromAPI()
            },
            error: (errorFromInterceptor) => {
                this.showError(errorFromInterceptor)
            }
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

    private clearStoredVariables(): void {
        this.localStorageService.deleteItems([
            { 'item': 'date', 'when': 'always' },
            { 'item': 'displayname', 'when': 'always' },
            { 'item': 'expiration', 'when': 'always' },
            { 'item': 'jwt', 'when': 'always' },
            { 'item': 'loginStatus', 'when': 'always' },
            { 'item': 'refreshToken', 'when': 'always' },
            { 'item': 'refNo', 'when': 'always' },
            { 'item': 'returnUrl', 'when': 'always' },
            { 'item': 'embarkation-criteria', 'when': 'production' },
        ])
    }

    private doSideMenuTogglerTasks(): void {
        this.accountService.isConnectedUserAdmin().subscribe(response => {
            this.interactionService.UpdateSideMenuTogglerState(response)
        })
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

    private populateLocalbaseFromAPI(): void {
        setTimeout(() => { this.localbaseDataService.readFromAPI('ports', this.portService), 1000 })
        setTimeout(() => { this.localbaseDataService.readFromAPI('destinations', this.destinationService) }, 2000)
        setTimeout(() => { this.localbaseDataService.readFromAPI('drivers', this.driverService) }, 3000)
        setTimeout(() => { this.localbaseDataService.readFromAPI('customers', this.customerService) }, 4000)
        setTimeout(() => { this.localbaseDataService.readFromAPI('pickupPoints', this.pickupPointService) }, 5000)
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle())
    }

    private showError(error: any): void {
        switch (error.status) {
            case 0:
                this.sweetAlertService.open(this.messageSnackbarService.noContactWithServer(), 'error', true, false, 'OK', '', 0)
                break
            case 401:
                this.sweetAlertService.open(this.messageSnackbarService.authenticationFailed(), 'error', true, false, 'OK', '', 0)
                break
            case 495:
                this.sweetAlertService.open(this.messageSnackbarService.accountNotConfirmed(), 'error', true, false, 'OK', '', 0)
                break
        }
    }

    private startIdleTimer(): void {
        this.idle.watch()
        this.idleState = 'NOT_IDLE'
        this.countdown = 0
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