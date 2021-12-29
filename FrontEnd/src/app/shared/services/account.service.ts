import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { map } from 'rxjs/operators'
// Custom
import { InteractionService } from './interaction.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class AccountService {

    //#region variables

    private readonly apiUrl = environment.apiUrl
    private readonly clientUrl = environment.clientUrl
    private displayName = new BehaviorSubject<string>(localStorage.getItem('displayName'))
    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private urlForgotPassword = this.apiUrl + '/account/forgotPassword'
    private urlRegister = this.apiUrl + '/account/register'
    private urlResetPassword = this.apiUrl + '/account/resetPassword'
    private urlToken = this.apiUrl + '/auth/auth'
    private urlIsAdmin = this.apiUrl + '/account/isAdmin'
    private userId = new BehaviorSubject<string>(localStorage.getItem('userId'))

    //#endregion

    constructor(private interactionService: InteractionService, private httpClient: HttpClient, private router: Router) { }

    //#region public methods

    public forgotPassword(formData: any): Observable<any> {
        return this.httpClient.post<any>(this.urlForgotPassword, formData)
    }

    public getNewRefreshToken(): Observable<any> {
        const userId = localStorage.getItem('userId')
        const refreshToken = localStorage.getItem('refreshToken')
        const grantType = 'refresh_token'
        return this.httpClient.post<any>(this.urlToken, { userId, refreshToken, grantType }).pipe(
            map(response => {
                console.log('Refresh token' + response.response.token)
                if (response.response.token) {
                    this.setLoginStatus(true)
                    this.setLocalStorage(response)
                    this.refreshMenus()
                }
                return <any>response
            })
        )
    }

    public isAdmin(id: string): Observable<any> {
        return this.httpClient.get<any>(this.urlIsAdmin + '/' + id).pipe(
            map(response => {
                return <any>response
            })
        )
    }

    public login(userName: string, password: string): Observable<void> {
        const grantType = 'password'
        const language = localStorage.getItem('language') || 'en'
        return this.httpClient.post<any>(this.urlToken, { language, userName, password, grantType }).pipe(map(response => {
            this.setLoginStatus(true)
            this.setLocalStorage(response)
            this.setUserData()
            this.refreshMenus()
        }))
    }

    public logout(): void {
        this.setLoginStatus(false)
        this.clearLocalStorage()
        this.refreshMenus()
        this.navigateToLogin()
    }

    public register(formData: any): Observable<any> {
        return this.httpClient.post<any>(this.urlRegister, formData)
    }

    public resetPassword(email: string, password: string, confirmPassword: string, token: string): Observable<any> {
        return this.httpClient.post<any>(this.urlResetPassword, { email, password, confirmPassword, token })
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

    private clearLocalStorage(): void {
        this.clearLocalStorageItems([
            'customerId',
            'date',
            'displayName',
            'expiration',
            'jwt',
            'loginStatus',
            'refreshToken',
            'reservations',
            'searchTermCustomer',
            'searchTermDestination',
            'searchTermDriver',
            'searchTermPickupPoint',
            'searchTermPort',
            'searchTermRoute',
            'searchTermUser',
            'selectedIds',
            'userId'
        ])
    }

    private clearLocalStorageItems(items: string[]): void {
        items.forEach(element => {
            localStorage.removeItem(element)
        })
    }

    private navigateToLogin(): void {
        this.router.navigate(['/login'])
    }

    private refreshMenus(): void {
        this.interactionService.mustRefreshMenus()
    }

    private setLocalStorage(response: any): void {
        localStorage.setItem('displayName', response.displayname)
        localStorage.setItem('expiration', response.expiration)
        localStorage.setItem('jwt', response.token)
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('refreshToken', response.refreshToken)
    }

    private setLoginStatus(status: boolean): void {
        this.loginStatus.next(status)
    }

    private setUserData(): void {
        this.displayName.next(localStorage.getItem('displayName'))
        this.userId.next(localStorage.getItem('userId'))
    }

    //#endregion

    //#region getters

    get currentDisplayName(): Observable<string> {
        return this.displayName.asObservable()
    }

    get isLoggedIn(): Observable<boolean> {
        return this.loginStatus.asObservable()
    }

    get currentUserId(): any {
        return this.userId.asObservable()
    }

    //#endregion

}
