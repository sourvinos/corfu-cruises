import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Observable, Subject, takeUntil } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'availability-menu',
    templateUrl: './availability-menu.component.html',
    styleUrls: ['./availability-menu.component.css']
})

export class AvailabilityMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    private url: string
    public loginStatus: Observable<boolean>
    public menuItems: [] = []

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
            }
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

    //#region private methods

    private createMenu(response: any): void {
        this.menuItems = response
    }

    private setActiveMenuItem(element: string) {
        document.getElementById(element).classList.add('active')
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
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

    //#region public methods

    public doNavigationTasks(feature: string): void {
        this.router.navigate([feature]).then(() => {
            setTimeout(() => {
                if (this.url.includes(feature)) {
                    this.setActiveMenuItem(feature)
                }
            }, 100)
        })
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    //#endregion

}
