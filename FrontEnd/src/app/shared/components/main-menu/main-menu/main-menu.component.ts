import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { AccountService } from 'src/app/shared/services/account.service'
// Custom
import { MainMenuDialog } from '../main-menu-dialog/main-menu-dialog.component'

@Component({
    selector: 'main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent {

    //#region variables

    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public showMainMenu(): void {
        this.dialog.open(MainMenuDialog)
    }

    //#endregion

    //#region private methods

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}

