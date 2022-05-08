import { Component } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'side-menu-toggler',
    templateUrl: './side-menu-toggler.component.html',
    styleUrls: ['./side-menu-toggler.component.css'],
    animations: [slideFromLeft]
})

export class SideMenuTogglerComponent {

    //#region variables

    public isSideMenuOpen = false
    public isTogglerEnabled = false
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.interactionService.isAdmin.subscribe(response => {
            this.isTogglerEnabled = response
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public toggleSideMenu(): void {
        if (this.isTogglerEnabled) {
            this.isSideMenuOpen = this.helperService.toggleScaleOnMainWindow()
            this.interactionService.sideMenuIsClosed.subscribe(() => {
                this.isSideMenuOpen = false
            })
        }
    }

    //#endregion

    //#region private methods

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}

