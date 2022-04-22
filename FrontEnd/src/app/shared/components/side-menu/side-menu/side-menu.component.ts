import { Component } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'
// Custom
import { AccountService } from './../../../services/account.service'
import { HelperService } from './../../../services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { environment } from './../../../../../environments/environment'

@Component({
    selector: 'side-menu',
    templateUrl: 'side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    private url: string
    public loginStatus: Observable<boolean>
    public menuItems: [] = []

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.createMenu(response)
            this.subscribeToInteractionService()
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public doNavigationTasks(feature: string): void {
        this.setMenuItemsAsInactive()
        this.router.navigate([feature]).then(() => {
            setTimeout(() => {
                if (this.url.includes(feature)) {
                    this.doSideMenuTasks()
                    this.setActiveMenuItem(feature)
                }
            }, 100)
        })
    }

    public doLogoutTasks(): void {
        this.helperService.hideSideMenuAndRestoreScale()
        this.interactionService.SideMenuIsClosed()
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private createMenu(response: any): void {
        this.menuItems = response
    }

    private doSideMenuTasks(): void {
        if (this.sideMenuMustHide()) {
            this.helperService.toggleScaleOnMainWindow()
            this.interactionService.SideMenuIsClosed()
        }
    }

    private setActiveMenuItem(element: string) {
        document.getElementById(element).classList.add('active')
    }

    private setMenuItemsAsInactive(): void {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active')
        })
    }

    private sideMenuMustHide(): boolean {
        return screen.height < 1050
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.menuItems = response
                this.createMenu(response)
            })
        })
    }

    //#endregion

}