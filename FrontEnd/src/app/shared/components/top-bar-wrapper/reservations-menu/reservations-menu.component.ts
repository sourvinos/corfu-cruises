import { Component, HostListener } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Observable, Subject, takeUntil } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'reservations-menu',
    templateUrl: './reservations-menu.component.html',
    styleUrls: ['./reservations-menu.component.css']
})

export class ReservationsMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    private url: string
    public loginStatus: Observable<boolean>
    public isAdmin: boolean
    public menuItems: [] = []

    //#endregion

    constructor(private messageSnackbarService: MessageSnackbarService, private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private modalActionResultService: ModalActionResultService, private router: Router) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
            }
        })
    }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.createMenu(response)
            this.subscribeToInteractionService()
            this.interactionService.isAdmin.subscribe(response => {
                this.isAdmin = response
            })
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region private methods

    private createMenu(response: any): void {
        this.menuItems = response
    }

    private setActiveMenuItem(element: string) {
        document.getElementById(element).classList.add('active')
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.menuItems = response
                this.createMenu(response)
            })
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

    //#region public methods

    public doNavigationTasks(feature: string): void {
        this.router.navigate([feature]).then(() => {
            setTimeout(() => {
                // if (this.url.includes(feature)) {
                //     this.setActiveMenuItem(feature)
                // }
            }, 100)
        })
    }

    public unavailable(): void {
        this.modalActionResultService.open(this.messageSnackbarService.featureNotAvailable(), 'error', ['ok'])
    }


    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    //#endregion

}
