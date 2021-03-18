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

    ngOnInit(): void {
        this.updateVariables()
    }

    //#region lifecycle hooks


    //#endregion

    //#region public methods


    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

    //#region private methods
    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }



    //#endregion

}
