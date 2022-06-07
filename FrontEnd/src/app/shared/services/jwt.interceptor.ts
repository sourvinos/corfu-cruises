import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators'
// Custom
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class JwtInterceptor {

    //#region variables

    private isTokenRefreshing = false
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null)

    //#endregion

    constructor(private accountService: AccountService) { }

    //#region public methods

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isUserLoggedIn()) {
            return next.handle(this.attachTokenToRequest(request)).pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        return
                    }
                }), catchError((err): Observable<any> => {
                    if (this.isUserLoggedIn()) {
                        return err.status == 401
                            ? this.refreshToken(request, next)
                            : this.trapError((<HttpErrorResponse>err).status)
                    }
                })
            )
        } else {
            return next.handle(request)
        }
    }

    //#endregion

    //#region private methods

    private attachTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
        const token = localStorage.getItem('jwt')
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.response.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.response.token)
                        localStorage.setItem('displayname', tokenresponse.response.displayname)
                        localStorage.setItem('expiration', tokenresponse.response.expiration)
                        localStorage.setItem('refreshToken', tokenresponse.response.refreshToken)
                        console.log('Token refreshed after expiration')
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(error => {
                    return throwError(() => error.status)
                }),
                finalize(() => {
                    this.isTokenRefreshing = false
                })
            )
        } else {
            this.isTokenRefreshing = false
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(() => next.handle(this.attachTokenToRequest(request))))
        }
    }

    private isUserLoggedIn(): boolean {
        return localStorage.getItem('loginStatus') === '1'
    }

    private trapError(err: number) {
        switch (err) {
            case 400:
                return throwError(() => new Error('400')) // invalidModel
            case 403:
                return throwError(() => new Error('403')) // unauthorized
            case 404:
                return throwError(() => new Error('404')) // not found
            case 409:
                return throwError(() => new Error('409')) // duplicate record (date, destination, customer, ticket no)
            case 427:
                return throwError(() => new Error('427')) // we don't have a departure for the selected date, destination and port
            case 430:
                return throwError(() => new Error('430')) // we don't have a trip for the selected date and destination
            case 431:
                return throwError(() => new Error('431')) // simple users can't add a reservation in the past
            case 432:
                return throwError(() => new Error('432')) // we don't have any trips for this day
            case 433:
                return throwError(() => new Error('433')) // no vacancy for port
            case 450:
                return throwError(() => new Error('450')) // customer does not exist or is inactive
            case 451:
                return throwError(() => new Error('451')) // destination does not exist or is inactive
            case 452:
                return throwError(() => new Error('452')) // pickup point does not exist or is inactive
            case 453:
                return throwError(() => new Error('453')) // driver does not exist or is inactive
            case 454:
                return throwError(() => new Error('454')) // ship does not exist or is inactive
            case 455:
                return throwError(() => new Error('455')) // invalid passenger count
            case 456:
                return throwError(() => new Error('456')) // nationality does not exist or is inactive
            case 457:
                return throwError(() => new Error('457')) // gender does not exist or is inactive
            case 458:
                return throwError(() => new Error('458')) // occupant does not exist or is inactive
            case 459:
                return throwError(() => new Error('459')) // reservation with transfer has night restrictions for simple user
            case 490:
                return throwError(() => new Error('490')) // unableToSaveRecord
            case 491:
                return throwError(() => new Error('491')) // recordInUse
            case 492:
                return throwError(() => new Error('492')) // unableToRegisterUser
            case 493:
                return throwError(() => new Error('493')) // unableToCreateFile
            case 494:
                return throwError(() => new Error('494')) // unableToChangePassword
            default:
                return throwError(() => new Error('500'))
        }
    }

    //#endregion

}
