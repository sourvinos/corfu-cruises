import { Component } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css']
})

export class UserMenuComponent {

    //#region variables

    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private localStorageService: LocalStorageService, private interactionService: InteractionService) { }

    //#region lifecycle hooks

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public doLogoutTasks(): void {
        this.helperService.hideSideMenuAndRestoreScale()
        this.interactionService.SideMenuIsClosed()
        this.accountService.logout()
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '-' + this.localStorageService.getItem('theme') + '.svg'
    }

    //#endregion

    //#region private methods

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
