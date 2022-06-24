import { ChangeDetectorRef, Component, HostListener } from '@angular/core'
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
// Custom
import { AccountService } from '../shared/services/account.service'
import { EmojiService } from '../shared/services/emoji.service'
import { HelperService } from '../shared/services/helper.service'
import { InteractionService } from '../shared/services/interaction.service'
import { MessageSnackbarService } from '../shared/services/messages-snackbar.service'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { slideFromLeft } from '../shared/animations/animations'
import { HubService } from '../shared/services/hub.service'

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

    constructor(private hubService: HubService, private accountService: AccountService, private cd: ChangeDetectorRef, private emojiService: EmojiService, private helperService: HelperService, private idle: Idle, private interactionService: InteractionService, private messageSnackbarService: MessageSnackbarService, private router: Router) {
        this.initIdleService()
        // this.hubService.startConnection()
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
        return this.emojiService.getEmoji('clock')
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
            this.helperService.hideSideMenuAndRestoreScale()
            this.interactionService.SideMenuIsClosed()
            this.accountService.logout()
        })
    }

    //#endregion

}
