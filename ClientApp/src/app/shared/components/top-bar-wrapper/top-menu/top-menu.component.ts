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
import { MessageTableService } from 'src/app/shared/services/messages-table.service'

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

    constructor(private accountService: AccountService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private interactionService: InteractionService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageMenuService: MessageMenuService, private messageSnackbarService: MessageSnackbarService, private messageTableService: MessageTableService, private router: Router) { }

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
                label: this.getLabel(menuItems, 'schedules'),
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/schedules'],
                visible: this.isUserLoggedIn()
            },
            {
                label: this.getLabel(menuItems, 'myAccount'),
                icon: 'pi pi-fw pi-user', visible: this.isUserLoggedIn(),
                items: [
                    {
                        label: this.getLabel(menuItems, 'editAccount'),
                        command: (): void => { this.editUser() }
                    },
                    {
                        label: this.getLabel(menuItems, 'logout'),
                        command: (): void => this.accountService.logout()
                    }]
            },
            {
                label: this.getLanguageLabel(),
                icon: this.getLanguageIcon(),
                items: [
                    {
                        label: 'Ελληνικά',
                        icon: 'flag el-GR',
                        command: (): string => this.doLanguageTasks('el-GR')
                    },
                    {
                        label: 'English',
                        icon: 'flag en-GB',
                        command: (): string => this.doLanguageTasks('en-GB')
                    },
                    {
                        label: 'Deutsch',
                        icon: 'flag de-DE',
                        command: (): string => this.doLanguageTasks('de-DE')
                    },
                    {
                        label: 'Český',
                        icon: 'flag cs-CZ',
                        command: (): string => this.doLanguageTasks('cs-CZ')
                    },
                    {
                        label: 'Française',
                        icon: 'flag fr-FR',
                        command: (): string => this.doLanguageTasks('fr-FR')
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

    private editUser(): void {
        let userId = ''
        this.accountService.currentUserId.subscribe((result: any) => {
            userId = result
        })
        this.updateStorageWithCallerForm()
        this.router.navigate(['/users', userId])
    }

    private getLanguageIcon(): string {
        const flag = this.helperService.readItem("language") == '' ? this.doLanguageTasks('en-GB') : this.helperService.readItem("language")
        return 'flag ' + flag
    }

    private getLanguageLabel(): string {
        const flag = this.helperService.readItem("language") == '' ? this.doLanguageTasks('en-GB') : this.helperService.readItem("language")
        switch (flag) {
            case 'el-GR': return 'Γλώσσα'
            case 'en-GB': return 'Language'
            case 'de-DE': return 'Sprache'
            case 'cs-CZ': return 'Jazyk'
            case 'fr-FR': return 'Langue'
        }
    }

    private getLabel(response: any[], label: string): string {
        return this.messageMenuService.getDescription(response, 'menus', label)
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
        this.messageTableService.getMessages()
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
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private updateStorageWithCallerForm(): void {
        this.helperService.saveItem('editUserCaller', 'menu')
    }

    //#endregion

}
