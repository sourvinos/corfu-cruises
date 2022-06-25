import { ChangeDetectorRef, Component, HostListener } from '@angular/core'
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
// Custom
import { AccountService } from '../shared/services/account.service'
import { HelperService } from '../shared/services/helper.service'
import { InteractionService } from '../shared/services/interaction.service'
import { MessageSnackbarService } from '../shared/services/messages-snackbar.service'
import { ModalActionResultService } from '../shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft } from '../shared/animations/animations'

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [slideFromLeft]
})

export class AppComponent {

    //#region variables

    public isLoading = true

    //#endregion

    constructor(private accountService: AccountService, private cd: ChangeDetectorRef, private helperService: HelperService, private idle: Idle, private interactionService: InteractionService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) {
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

    //#region private methods

    private initIdleService(): void {
        this.interactionService.isAdmin.subscribe((response) => {
            if (response) {
                this.idle.setIdle(environment.idleSettings.admins.idle)
                this.idle.setTimeout(environment.idleSettings.admins.timeout)
            } else {
                this.idle.setIdle(environment.idleSettings.simpleUsers.idle)
                this.idle.setTimeout(environment.idleSettings.simpleUsers.timeout)
            }
        })
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES)
        this.idle.watch()
        this.idle.onIdleEnd.subscribe(() => {
            this.cd.detectChanges()
        })
        this.idle.onTimeout.subscribe(() => {
            this.helperService.hideSideMenuAndRestoreScale()
            this.interactionService.SideMenuIsClosed()
            this.accountService.logout()
            this.modalActionResultService.open(this.messageSnackbarService.userDisconnected(), 'info', ['ok'])
        })
    }

    //#endregion

}
