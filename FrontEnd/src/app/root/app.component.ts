import { ChangeDetectorRef, Component, HostListener } from '@angular/core'
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
// Custom
import { AccountService } from '../shared/services/account.service'
import { EmojiService } from '../shared/services/emoji.service'
import { MessageSnackbarService } from '../shared/services/messages-snackbar.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft } from '../shared/animations/animations'
import { Observable } from 'rxjs'

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [slideFromLeft]
})

export class AppComponent {

    //#region variables

    public isLoading = true
    public countdown = 0
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private cd: ChangeDetectorRef, private emojiService: EmojiService, private idle: Idle, private messageSnackbarService: MessageSnackbarService, private router: Router) {
        this.initIdleService()
        this.router.events.subscribe((routerEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.isLoading = true
            }
            if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
                this.isLoading = false
            }
        })
    }

    //#region listeners

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(): any {
        this.accountService.logout()
    }

    //#endregion

    //#region public methods

    public getEmoji(): string {
        return this.emojiService.getEmoji('inactive-user')
    }

    public getMessage(): string {
        return this.messageSnackbarService.timeoutWarning(this.countdown) + '"'
    }

    //#endregion

    //#region private methods

    private initIdleService(): void {
        this.idle.setIdle(environment.idleSettings.idle)
        this.idle.setTimeout(environment.idleSettings.timeout)
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES)
        this.idle.watch()
        this.idle.onIdleEnd.subscribe(() => {
            this.countdown = 0
            this.cd.detectChanges()
        })
        this.idle.onTimeoutWarning.subscribe(seconds => {
            this.countdown = seconds
        })
        this.idle.onTimeout.subscribe(() => {
            this.countdown = 0
            this.accountService.logout()
        })
    }

    //#endregion

}
