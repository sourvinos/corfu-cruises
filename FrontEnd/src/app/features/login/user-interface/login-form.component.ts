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
import { DestinationService } from '../../destinations/classes/services/destination.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverService } from '../../drivers/classes/services/driver.service'
import { GenderService } from '../../genders/classes/services/gender.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { NationalityService } from 'src/app/features/nationalities/classes/services/nationality.service'
import { PickupPointService } from '../../pickupPoints/classes/services/pickupPoint.service'
import { PortService } from '../../ports/classes/services/port.service'
import { ShipService } from '../../ships/classes/services/ship.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { HubService } from 'src/app/shared/services/hub.service'

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

    constructor(private hubService: HubService, private accountService: AccountService, private buttonClickService: ButtonClickService, private customerService: CustomerService, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private idle: Idle, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private pickupPointService: PickupPointService, private portService: PortService, private router: Router, private shipService: ShipService, private titleService: Title) { }

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
                this.populateStorageFromAPI()
                this.doSideMenuTogglerTasks()
                this.hubService.startConnection()
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

    private populateStorageFromAPI(): void {
        this.customerService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('customers', JSON.stringify(response)) })
        this.destinationService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('destinations', JSON.stringify(response)) })
        this.driverService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('drivers', JSON.stringify(response)) })
        this.genderService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('genders', JSON.stringify(response)) })
        this.nationalityService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('nationalities', JSON.stringify(response)) })
        this.pickupPointService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('pickupPoints', JSON.stringify(response)) })
        this.portService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('ports', JSON.stringify(response)) })
        this.shipService.getActiveForDropdown().subscribe(response => { this.localStorageService.saveItem('ships', JSON.stringify(response)) })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle())
    }

    private showError(error: any): void {
        switch (error.status) {
            case 0:
                this.dialogService.open(this.messageSnackbarService.noContactWithServer(), 'error', ['ok'])
                break
            case 401:
                this.dialogService.open(this.messageSnackbarService.authenticationFailed(), 'error', ['ok'])
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