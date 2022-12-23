import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { map } from 'rxjs/operators'
// Custom
import { ChangePasswordViewModel } from 'src/app/features/users/classes/view-models/change-password-view-model'
import { CoachRouteService } from 'src/app/features/coachRoutes/classes/services/coachRoute.service'
import { ConnectedUser } from '../classes/connected-user'
import { CustomerService } from 'src/app/features/customers/classes/services/customer.service'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { DriverService } from 'src/app/features/drivers/classes/services/driver.service'
import { GenderService } from 'src/app/features/genders/classes/services/gender.service'
import { HttpDataService } from './http-data.service'
import { InteractionService } from './interaction.service'
import { LocalStorageService } from './local-storage.service'
import { NationalityService } from 'src/app/features/nationalities/classes/services/nationality.service'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/services/pickupPoint.service'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ResetPasswordViewModel } from 'src/app/features/users/classes/view-models/reset-password-view-model'
import { ShipOwnerService } from 'src/app/features/shipOwners/classes/services/shipOwner.service'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { environment } from 'src/environments/environment'
import { ShipRouteService } from 'src/app/features/shipRoutes/classes/services/shipRoute.service'

@Injectable({ providedIn: 'root' })

export class AccountService extends HttpDataService {

    //#region variables

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private apiUrl = environment.apiUrl
    private urlForgotPassword = this.apiUrl + '/account/forgotPassword'
    private urlRegister = this.apiUrl + '/account'
    private urlResetPassword = this.apiUrl + '/account/resetPassword'
    private urlGetConnectedUserId = this.apiUrl + '/account/getConnectedUserId'
    private urlIsAdmin = this.apiUrl + '/account/isConnectedUserAdmin'
    private urlToken = this.apiUrl + '/auth/auth'

    //#endregion

    constructor(httpClient: HttpClient, private coachRouteService: CoachRouteService, private customerService: CustomerService, private destinationService: DestinationService, private driverService: DriverService, private genderService: GenderService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private nationalityService: NationalityService, private ngZone: NgZone, private pickupPointService: PickupPointService, private portService: PortService, private router: Router, private shipOwnerService: ShipOwnerService, private shipRouteService: ShipRouteService, private shipService: ShipService) {
        super(httpClient, environment.apiUrl)
    }

    //#region public methods

    public changePassword(formData: ChangePasswordViewModel): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/account/changePassword/', formData)
    }

    public clearStoredVariables(): void {
        this.localStorageService.deleteItems([
            // Auth
            { 'item': 'expiration', 'when': 'always' },
            { 'item': 'jwt', 'when': 'always' },
            { 'item': 'loginStatus', 'when': 'always' },
            { 'item': 'refreshToken', 'when': 'always' },
            { 'item': 'returnUrl', 'when': 'always' },
            // Reservations
            { 'item': 'date', 'when': 'always' },
            { 'item': 'scrollLeft', 'when': 'always' },
            { 'item': 'year', 'when': 'always' },
            //  calendars
            { 'item': 'activeYearAvailability', 'when': 'always' },
            { 'item': 'activeYearReservations', 'when': 'always' },
            // Criteria
            { 'item': 'embarkation-criteria', 'when': 'production' },
            { 'item': 'invoicing-criteria', 'when': 'production' },
            { 'item': 'manifest-criteria', 'when': 'production' },
            // Table filters
            { 'item': 'coachRoute-list', 'when': 'always' },
            { 'item': 'customer-list', 'when': 'always' },
            { 'item': 'destination-list', 'when': 'always' },
            { 'item': 'driver-list', 'when': 'always' },
            { 'item': 'gender-list', 'when': 'always' },
            { 'item': 'pickupPoint-list', 'when': 'always' },
            { 'item': 'port-list', 'when': 'always' },
            { 'item': 'registrar-list', 'when': 'always' },
            { 'item': 'schedule-list', 'when': 'always' },
            { 'item': 'ship-list', 'when': 'always' },
            { 'item': 'shipCrew-list', 'when': 'always' },
            { 'item': 'shipOwner-list', 'when': 'always' },
            { 'item': 'shipRoute-list', 'when': 'always' },
            { 'item': 'user-list', 'when': 'always' },
            // Tables
            { 'item': 'coachRoutes', 'when': 'always' },
            { 'item': 'customers', 'when': 'always' },
            { 'item': 'destinations', 'when': 'always' },
            { 'item': 'drivers', 'when': 'always' },
            { 'item': 'genders', 'when': 'always' },
            { 'item': 'nationalities', 'when': 'always' },
            { 'item': 'pickupPoints', 'when': 'always' },
            { 'item': 'ports', 'when': 'always' },
            { 'item': 'shipOwners', 'when': 'always' },
            { 'item': 'ships', 'when': 'always' }
        ])
    }

    public forgotPassword(formData: any): Observable<any> {
        return this.http.post<any>(this.urlForgotPassword, formData)
    }

    public getConnectedUserId(): Observable<any> {
        return this.http.get(this.urlGetConnectedUserId, { responseType: 'text' }).pipe(
            map(response => {
                return <any>response
            })
        )
    }

    public getNewRefreshToken(): Observable<any> {
        const userId = localStorage.getItem('userId')
        const refreshToken = localStorage.getItem('refreshToken')
        const grantType = 'refresh_token'
        return this.http.post<any>(this.urlToken, { userId, refreshToken, grantType }).pipe(
            map(response => {
                if (response.response.token) {
                    this.setLoginStatus(true)
                    this.setAuthSettings(response.response)
                }
                return <any>response
            })
        )
    }

    public isConnectedUserAdmin(): Observable<any> {
        return this.http.get(this.urlIsAdmin, { responseType: 'text' }).pipe(
            map(response => {
                return <any>response
            })
        )
    }

    public login(userName: string, password: string): Observable<void> {
        const grantType = 'password'
        const language = localStorage.getItem('language') || 'en-GB'
        return this.http.post<any>(this.urlToken, { language, userName, password, grantType }).pipe(map(response => {
            this.setLoginStatus(true)
            this.setUserData(response)
            this.setAuthSettings(response)
            this.populateStorageFromAPI()
            this.refreshMenus()
        }))
    }

    public logout(): void {
        this.setLoginStatus(false)
        this.clearStoredVariables()
        this.refreshMenus()
        this.navigateToLogin()
    }

    public add(formData: any): Observable<any> {
        return this.http.post<any>(this.urlRegister, formData)
    }

    public resetPassword(vm: ResetPasswordViewModel): Observable<any> {
        return this.http.post<any>(this.urlResetPassword, vm)
    }

    //#endregion

    //#region private methods

    private checkLoginStatus(): boolean {
        const loginCookie = localStorage.getItem('loginStatus')
        if (loginCookie === '1') {
            if (localStorage.getItem('jwt') !== null || localStorage.getItem('jwt') !== undefined) {
                return true
            }
        }
        return false
    }

    private navigateToLogin(): void {
        this.ngZone.run(() => {
            this.router.navigate(['/login'])
        })
    }

    private refreshMenus(): void {
        this.interactionService.updateMenus()
    }

    private setAuthSettings(response: any): void {
        localStorage.setItem('expiration', response.expiration)
        localStorage.setItem('jwt', response.token)
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('refreshToken', response.refreshToken)
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
        this.shipRouteService.getActive().subscribe(response => { this.localStorageService.saveItem('shipRoutes', JSON.stringify(response)) })
    }

    private setLoginStatus(status: boolean): void {
        this.loginStatus.next(status)
    }

    private setUserData(response: any): void {
        ConnectedUser.id = response.userId
        ConnectedUser.displayname = response.displayname
        ConnectedUser.isAdmin = response.isAdmin
        ConnectedUser.customerId = response.customerId
    }

    //#endregion

    //#region  getters

    get isLoggedIn(): Observable<boolean> {
        return this.loginStatus.asObservable()
    }

    //#endregion

}
