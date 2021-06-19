import { Component } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { AccountService } from '../../../services/account.service'
import { MessageMenuService } from '../../../services/messages-menu.service'
import { slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css'],
    animations: [slideFromLeft]
})

export class SideMenuComponent {

    //#region  variables

    private feature = 'main-menu'
    private userRole: Observable<string>
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private messageMenuService: MessageMenuService) { }

    //#region lifecycle hooks

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public onDoTasks(event: Event): void {
        this.closeSidebar(event)
        this.hideSubmenus()
    }

    public onGetLabel(id: string): string {
        return this.messageMenuService.getDescription(this.feature, id)
    }

    public onLogout(): void {
        this.accountService.logout()
    }

    public onOpenSidebar(): void {
        document.getElementById('sidemenu').classList.add('open')
    }

    public onShowSubmenu(subMenu: string, spanId: string, event: { stopPropagation: () => void }): void {
        document.getElementById('sidemenu').classList.add('open')
        document.getElementById(subMenu).classList.toggle('show')
        document.getElementById(spanId).classList.toggle('rotate')
        event.stopPropagation()
    }

    //#endregion

    //#region private methods

    private closeSidebar(event: Event): void {
        event.stopPropagation()
        document.getElementById('sidemenu').classList.remove('open')
    }

    private hideSubmenus(): void {
        Array.from(document.querySelectorAll('ul')).forEach((el) => el.classList.remove('show'))
        Array.from(document.querySelectorAll('span.expander')).forEach((el) => el.classList.remove('rotate'))
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
        this.userRole = this.accountService.currentUserRole
    }

    //#endregion

    //#region getters

    get isConnectedUserAdmin(): boolean {
        let isAdmin = false
        this.userRole.subscribe(result => {
            isAdmin = result == 'Admin' ? true : false
        })
        return isAdmin
    }

    //#endregion

}
