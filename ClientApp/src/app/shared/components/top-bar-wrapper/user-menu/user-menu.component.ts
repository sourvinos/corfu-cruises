import { Component, HostListener } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css']
})

export class UserMenuComponent {

    //#region variables

    private baseUrl = '/users'
    private feature = 'user-menu'
    public displayName: Observable<string>
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private messageLabelService: MessageLabelService, private router: Router) { }

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

    public onEditUser(): void {
        let userId = ''
        this.accountService.currentUserId.subscribe((result: any) => {
            userId = result
        })
        this.updateStorageWithCallerForm()
        this.router.navigate([this.baseUrl, userId])
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onHideMenu(): void {
        const menu = (<HTMLElement>document.getElementById('hamburger-menu')); menu.classList.remove('visible')
        const nav = (<HTMLElement>document.getElementById('secondary-menu')); nav.classList.remove('visible')
    }

    public onLogout(): void {
        this.onHideMenu()
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private updateStorageWithCallerForm(): void {
        this.helperService.saveItem('editUserCaller', 'menu')
    }

    private updateVariables(): void {
        this.displayName = this.accountService.currentDisplayName
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
