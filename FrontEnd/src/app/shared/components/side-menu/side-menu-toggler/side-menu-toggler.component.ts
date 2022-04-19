import { Component } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'

@Component({
    selector: 'side-menu-toggler',
    templateUrl: './side-menu-toggler.component.html',
    styleUrls: ['./side-menu-toggler.component.css']
})

export class SideMenuTogglerComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public loginStatus: Observable<boolean>
    public isSideMenuOpen = false

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService) { }

    //#region lifecycle hooks

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public toggleSideMenu(): void {
        this.isSideMenuOpen = this.helperService.toggleScaleOnMainWindow()
        this.interactionService.sideMenuIsClosed.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.isSideMenuOpen = false
        })
    }

    //#endregion

    //#region private methods

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}

