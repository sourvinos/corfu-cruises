import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Idle } from '@ng-idle/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { AccountService } from '../../../shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CoachRouteService } from '../../coachRoutes/classes/services/coachRoute.service'
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
import { ShipOwnerService } from '../../shipOwners/classes/services/shipOwner.service'
import { ShipService } from '../../ships/classes/services/ship.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', '../../../shared/styles/login-forgot-password-form.css']
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
    public idleState = 'NOT_STARTED'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private accountService: AccountService, private buttonClickService: ButtonClickService, private coachRouteService: CoachRouteService, private customerService: CustomerService, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private idle: Idle, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private pickupPointService: PickupPointService, private portService: PortService, private router: Router, private shipService: ShipService, private shipOwnerService: ShipOwnerService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.addShortcuts()
        this.clearStoredVariables()
        this.focusOnField('username')
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

    public getLineA(): string {
        const lineA = this.helperService.getApplicationTitle[0]
        return lineA
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
            { 'item': 'embarkation-criteria', 'when': 'production' },
            { 'item': 'expiration', 'when': 'always' },
            { 'item': 'invocing-criteria', 'when': 'production' },
            { 'item': 'jwt', 'when': 'always' },
            { 'item': 'loginStatus', 'when': 'always' },
            { 'item': 'manifest-criteria', 'when': 'production' },
            { 'item': 'refreshToken', 'when': 'always' },
            { 'item': 'returnUrl', 'when': 'always' },
        ])
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
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
        this.coachRouteService.getActive().subscribe(response => { this.localStorageService.saveItem('coachRoutes', JSON.stringify(response)) })
        this.customerService.getActive().subscribe(response => { this.localStorageService.saveItem('customers', JSON.stringify(response)) })
        this.destinationService.getActive().subscribe(response => { this.localStorageService.saveItem('destinations', JSON.stringify(response)) })
        this.driverService.getActive().subscribe(response => { this.localStorageService.saveItem('drivers', JSON.stringify(response)) })
        this.genderService.getActive().subscribe(response => { this.localStorageService.saveItem('genders', JSON.stringify(response)) })
        this.nationalityService.getActive().subscribe(response => { this.localStorageService.saveItem('nationalities', JSON.stringify(response)) })
        this.pickupPointService.getActive().subscribe(response => { this.localStorageService.saveItem('pickupPoints', JSON.stringify(response)) })
        this.portService.getActive().subscribe(response => { this.localStorageService.saveItem('ports', JSON.stringify(response)) })
        this.shipService.getActive().subscribe(response => { this.localStorageService.saveItem('ships', JSON.stringify(response)) })
        this.shipOwnerService.getActive().subscribe(response => { this.localStorageService.saveItem('shipOwners', JSON.stringify(response)) })
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