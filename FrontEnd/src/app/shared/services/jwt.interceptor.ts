import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators'
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class JwtInterceptor {

    //#region variables

    private isTokenRefreshing = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    //#endregion

    constructor(private accountService: AccountService) { }

    //#region public methods

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isUserLoggedIn()) {
            return next.handle(this.attachTokenToRequest(request)).pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) { return }
                }), catchError((err): Observable<any> => {
                    if (this.isUserLoggedIn()) {
                        if (err instanceof HttpErrorResponse) {
                            switch ((<HttpErrorResponse>err).status) {
                                case 0:
                                    return throwError(500) // no contact with api
                                case 400:
                                    return throwError(400) // invalidModel
                                case 401:
                                    return this.handleHttpErrorResponse(request, next)
                                case 403:
                                    return throwError(403)
                                case 404:
                                    return throwError(404)
                                case 409:
                                    return throwError(409) // duplicate record (date, destination, customer, ticket no)
                                case 427:
                                    return throwError(427) // we don't have a departure for the selected date, destination and port
                                case 430:
                                    return throwError(430) // we don't have a trip for the selected date and destination
                                case 431:
                                    return throwError(431) // simple users can't add a reservation in the past
                                case 432:
                                    return throwError(432) // we don't have any trips for this day
                                case 433:
                                    return throwError(433) // no vacancy for port
                                case 450:
                                    return throwError(450) // customer does not exist or is inactive
                                case 451:
                                    return throwError(451) // destination does not exist or is inactive
                                case 452:
                                    return throwError(452) // pickup point does not exist or is inactive
                                case 453:
                                    return throwError(453) // driver does not exist or is inactive
                                case 454:
                                    return throwError(454) // ship does not exist or is inactive
                                case 455:
                                    return throwError(455) // invalid passenger count
                                case 456:
                                    return throwError(456) // nationality does not exist or is inactive
                                case 457:
                                    return throwError(457) // gender does not exist or is inactive
                                case 458:
                                    return throwError(458) // occupant does not exist or is inactive
                                case 490:
                                    return throwError(490) // unableToSaveRecord
                                case 491:
                                    return throwError(491) // recordInUse
                                case 492:
                                    return throwError(492) // unableToRegisterUser
                                case 493:
                                    return throwError(493) // unableToCreateFile
                                case 494:
                                    return throwError(494) // unableToChangePassword
                                case 500:
                                    return throwError(500) // no contact with api
                            }
                        } else {
                            return throwError(this.handleError)
                        }
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

    private handleError(errorResponse: HttpErrorResponse): string {
        if (errorResponse.error instanceof Error) {
            return `Front-end error ${errorResponse.error.message}`
        } else {
            return `Server error ${errorResponse.status} ${errorResponse.error}`
        }
    }

    private handleHttpErrorResponse(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.response.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.response.token)
                        localStorage.setItem('userId', tokenresponse.response.userId)
                        localStorage.setItem('displayName', tokenresponse.response.displayName)
                        localStorage.setItem('expiration', tokenresponse.response.expiration)
                        localStorage.setItem('userRole', tokenresponse.response.roles)
                        localStorage.setItem('refreshToken', tokenresponse.response.refresh_token)
                        console.log('Token refreshed')
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(error => {
                    this.accountService.logout()
                    return this.handleError(error)
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

    //#endregion

}
