import { Component, HostListener } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
import { Router } from '@angular/router'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageMenuService } from '../../services/messages-menu.service'
import { MessageSnackbarService } from '../../services/messages-snackbar.service'
import { ModalActionResultService } from '../../services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css']
})

export class UserMenuComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public loginStatus: Observable<boolean>
    public menuItems: [] = []

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageMenuService: MessageMenuService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

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
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public editAccount(): void {
        this.modalActionResultService.open(this.messageSnackbarService.featureNotAvailable(), 'error', ['ok'])
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '-' + this.localStorageService.getItem('my-theme') + '.svg'
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public logout(): void {
        this.helperService.hideSideMenuAndRestoreScale()
        this.interactionService.SideMenuIsClosed()
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private createMenu(response: any): void {
        this.menuItems = response
    }

    public getUserDisplayname(): string {
        let userDisplayName = ''
        this.accountService.getUserDisplayname.subscribe(result => {
            userDisplayName = result
        })
        return userDisplayName
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
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

}
