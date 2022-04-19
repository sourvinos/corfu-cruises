import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
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

    public loginStatus: Observable<boolean>
    public menuItems: [] = []

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.buildMenu(response)
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
        this.doSideMenuTasks()
        this.setActiveMenuItem(feature)
        this.navigateToRoute(feature)
    }

    public doLogoutTasks(): void {
        this.helperService.hideSideMenuAndRestoreScale()
        this.interactionService.SideMenuIsClosed()
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private buildMenu(response: any): void {
        this.menuItems = response
    }

    private doSideMenuTasks(): void {
        if (this.sideMenuMustHide()) {
            this.helperService.toggleScaleOnMainWindow()
            this.interactionService.SideMenuIsClosed()
        }
    }

    private navigateToRoute(feature: any): void {
        this.router.navigate([feature])
    }

    private setActiveMenuItem(element: string) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active')
        })
        document.getElementById(element).classList.add('active')
    }

    private sideMenuMustHide(): boolean {
        return screen.height < 1050
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}