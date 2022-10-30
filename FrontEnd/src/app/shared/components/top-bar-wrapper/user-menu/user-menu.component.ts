import { Component, HostListener } from '@angular/core'
import { Router } from '@angular/router'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageMenuService } from '../../../services/messages-menu.service'
import { environment } from 'src/environments/environment'
import { ConnectedUser } from 'src/app/shared/classes/connected-user'

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css']
})

export class UserMenuComponent {

    //#region variables

    private userId: string
    public displayedUsername: string
    public menuItems = []

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageMenuService: MessageMenuService, private router: Router) { }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getMenuItemsFromSubscription()
        this.getUserDetailsFromSubscription()
    }

    //#endregion

    //#region public methods

    public editRecord(): void {
        this.localStorageService.saveItem('returnUrl', '/')
        this.router.navigate(['/users/' + this.userId])
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '-' + this.localStorageService.getItem('my-theme') + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public logout(): void {
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private getMenuItemsFromSubscription(): void {
        this.interactionService.refreshMenus.subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.menuItems = response
            })
        })
    }

    private getUserDetailsFromSubscription(): void {
        this.displayedUsername = ConnectedUser.displayname
    }

    //#endregion

}
