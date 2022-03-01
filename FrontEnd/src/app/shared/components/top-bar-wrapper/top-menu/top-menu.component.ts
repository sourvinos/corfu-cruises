import idleService from '@kurtz1993/idle-service'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'

@Component({
    selector: 'top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.css']
})

export class TopMenuComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    public menuItems: MenuItem[]

    //#endregion

    constructor(private accountService: AccountService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private interactionService: InteractionService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageMenuService: MessageMenuService, private messageSnackbarService: MessageSnackbarService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.buildMenu(response)
            this.subscribeToInteractionService()
        })
    }

    //#endregion

    //#region private methods

    private buildMenu(menuItems: any): void {
        this.menuItems = [
            {
                label: this.getLabel(menuItems, 'calendar'),
                icon: 'fas fa-calendar',
                routerLink: ['schedules/calendar'],
                visible: this.isUserLoggedIn()
            },
            {
                label: this.getUserDisplayName(),
                icon: 'fas fa-user-alt', visible: this.isUserLoggedIn(),
                items: [
                    {
                        label: this.getLabel(menuItems, 'editAccount'),
                        icon: 'fas fa-pen-alt',
                        command: (): void => {
                            this.router.navigate(['/users/edit'], { queryParams: { returnUrl: '/' } })
                        }
                    },
                    {
                        label: this.getLabel(menuItems, 'logout'),
                        icon: 'fas fa-power-off',
                        command: (): void => {
                            this.accountService.logout()
                            idleService.stop()
                        }
                    }]
            },
            {
                label: '',
                icon: this.getLanguageIcon(),
                id: 'language-icon',
                items: [
                    {
                        label: 'Ελληνικά',
                        icon: 'flag el-gr',
                        command: (): string => this.doLanguageTasks('el-gr')
                    },
                    {
                        label: 'English',
                        icon: 'flag en-gb',
                        command: (): string => this.doLanguageTasks('en-gb')
                    },
                    {
                        label: 'Deutsch',
                        icon: 'flag de-de',
                        command: (): string => this.doLanguageTasks('de-de')
                    },
                    {
                        label: 'Český',
                        icon: 'flag cs-cz',
                        command: (): string => this.doLanguageTasks('cs-cz')
                    },
                    {
                        label: 'Française',
                        icon: 'flag fr-fr',
                        command: (): string => this.doLanguageTasks('fr-fr')
                    },
                ]
            }
        ]
    }

    private doLanguageTasks(language: string): string {
        this.saveLanguage(language)
        this.loadMessages()
        this.updateDateAdapter()
        this.messageMenuService.getMessages().then((response) => {
            this.buildMenu(response)
        })
        return language
    }

    private getLanguageIcon(): string {
        const flag = this.helperService.readItem('language') == '' ? this.doLanguageTasks('en-gb') : this.helperService.readItem('language')
        return 'flag ' + flag
    }

    private getLabel(response: any[], label: string): string {
        return this.messageMenuService.getDescription(response, 'menus', label)
    }

    private getUserDisplayName(): string {
        let userDisplayName = ''
        this.accountService.getUserDisplayName.subscribe(result => {
            userDisplayName = result
        })
        return userDisplayName
    }


    private isUserLoggedIn(): boolean {
        let isLoggedIn = false
        this.accountService.isLoggedIn.subscribe(result => {
            isLoggedIn = result
        })
        return isLoggedIn
    }

    private loadMessages(): void {
        this.messageCalendarService.getMessages()
        this.messageHintService.getMessages()
        this.messageLabelService.getMessages()
        this.messageMenuService.getMessages()
        this.messageSnackbarService.getMessages()
        this.interactionService.mustRefreshMenus()
    }

    private saveLanguage(language: string): void {
        this.helperService.saveItem('language', language)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.buildMenu(response)
            })
        })
    }

    private updateDateAdapter(): void {
        this.dateAdapter.setLocale(this.helperService.readItem('language'))
    }

    //#endregion

}
