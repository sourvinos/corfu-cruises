import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { AccountService } from '../../../services/account.service'
import { MessageMenuService } from '../../../services/messages-menu.service'

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent {

    //#region  variables

    private feature = 'main-menu'
    public loginStatus: Observable<boolean>
    private userRole: Observable<string>

    //#endregion

    constructor(private accountService: AccountService, private messageMenuService: MessageMenuService) { }

    //#region lifecycle hooks
    
    ngOnInit(): void {
        document.getElementById('sidemenu').classList.add('closed')
    }

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
        document.getElementById('sidemenu').classList.remove('closed')
    }

    public onShowSubmenu(subMenu: string, spanId: string, event: { stopPropagation: () => void }): void {
        document.getElementById('sidemenu').classList.add('open')
        document.getElementById('sidemenu').classList.remove('closed')
        document.getElementById(subMenu).classList.toggle('show')
        document.getElementById(spanId).classList.toggle('rotate')
        event.stopPropagation()
    }

    //#endregion

    //#region private methods

    private closeSidebar(event: Event): void {
        event.stopPropagation()
        document.getElementById('sidemenu').classList.remove('open')
        document.getElementById('sidemenu').classList.add('closed')
    }

    private hideSubmenus(): void {
        Array.from(document.querySelectorAll('ul')).forEach((el) => el.classList.remove('show'))
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
