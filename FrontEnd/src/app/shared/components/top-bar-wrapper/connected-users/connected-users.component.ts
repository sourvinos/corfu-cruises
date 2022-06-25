import { Component } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'connected-users',
    templateUrl: './connected-users.component.html',
    styleUrls: ['./connected-users.component.css']
})

export class ConnectedUsersComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public connectedUserCount: number
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private localStorageService: LocalStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.subscribeToInteractionService()
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '-' + this.localStorageService.getItem('my-theme') + '.svg'
    }

    //#endregion

    //#region private methods

    private subscribeToInteractionService(): void {
        this.interactionService.connectedUserCount.pipe(takeUntil(this.unsubscribe)).subscribe((response) => {
            this.connectedUserCount = response
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
