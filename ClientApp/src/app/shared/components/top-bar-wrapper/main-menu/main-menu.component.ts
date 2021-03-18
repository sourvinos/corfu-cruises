import { Component, HostListener } from '@angular/core'
import { AccountService } from 'src/app/shared/services/account.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { Observable } from 'rxjs'

@Component({
    selector: 'main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent {

    //#region variables

    private feature = 'main-menu'
    public loginStatus: Observable<boolean>
    private userRole: Observable<string>

    //#endregion

    constructor(private accountService: AccountService, private messageMenuService: MessageMenuService) { }

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageMenuService.getDescription(this.feature, id)
    }

    public onHideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    //#endregion

    //#region private methods

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