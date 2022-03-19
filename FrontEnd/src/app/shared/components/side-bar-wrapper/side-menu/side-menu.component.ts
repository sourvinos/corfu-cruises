import { Component } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css'],
    animations: [slideFromLeft]
})

export class SideMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    public loginStatus: Observable<boolean>
    public menuItems: [] = []

    //#endregion

    constructor(private router: Router, private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private emojiService: EmojiService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.buildMenu(response)
            this.subscribeToInteractionService()
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public getEmoji(symbol: string): string {
        return this.emojiService.getEmoji(symbol)
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public doTasks(element: string, feature: string): void {
        this.navigateToFeature(feature)
        this.styleMenu(element, '0')
    }

    //#endregion

    //#region private methods

    private buildMenu(response) {
        this.menuItems = response
    }

    private navigateToFeature(feature: string): void {
        this.router.navigate([feature])
    }

    public styleMenu(element: string, width: string) {
        if (document.getElementById(element)) {
            document.getElementById(element).style.height = 'auto'
            document.getElementById(element).style.padding = '10px 10px 10px 0;'
            document.getElementById(element).style.position = 'absolute'
            document.getElementById(element).style.transition = 'width 0.3s ease-in-out'
            document.getElementById(element).style.width = width
            document.getElementById(element).style.zIndex = '1'
        }
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.buildMenu(response)
            })
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
