import { Component } from '@angular/core'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Observable } from 'rxjs'
import { AccountService } from 'src/app/shared/services/account.service'

@Component({
    selector: 'schedule-menu',
    templateUrl: './schedule-menu.component.html',
    styleUrls: ['./schedule-menu.component.css']
})

export class ScheduleMenuComponent {

    //#region variables

    private feature = 'schedule-menu'
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private messageLabelService: MessageLabelService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods


    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onHideMenu(): void {
        const menu = (<HTMLElement>document.getElementById('hamburger-menu')); menu.classList.remove('visible')
        const nav = (<HTMLElement>document.getElementById('secondary-menu')); nav.classList.remove('visible')
    }

    //#endregion

    //#region private methods
    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }



    //#endregion

}
