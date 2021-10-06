import idleService from '@kurtz1993/idle-service'
import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api/menuitem'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from '../../../services/account.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from '../../../services/messages-menu.service'

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private userRole: Observable<string>
    public bottomItems: MenuItem[]
    public loginStatus: Observable<boolean>
    public topItems: MenuItem[]

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService) { }

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

    //#region private methods

    private buildMenu(menuItems: any[]): void {
        this.topItems = [
            {
                label: this.getLabel(menuItems, 'home'),
                icon: 'fas fa-home',
                routerLink: ['/']
            },
            {
                label: this.getLabel(menuItems, 'passengers'),
                icon: 'fas fa-users',
                items: [
                    { label: this.getLabel(menuItems, 'embarkation'), routerLink: 'embarkation' },
                    { label: this.getLabel(menuItems, 'manifest'), routerLink: '/manifest' }
                ]
            },
            {
                label: this.getLabel(menuItems, 'reservations'),
                icon: 'fab fa-buffer',
                items: [
                    { label: this.getLabel(menuItems, 'dashboard'), routerLink: 'reservations' },
                    { label: this.getLabel(menuItems, 'invoicing'), routerLink: 'invoicing' }
                ]
            },
            {
                label: this.getLabel(menuItems, 'tables'),
                icon: 'fas fa-table',
                items: [
                    { label: this.getLabel(menuItems, 'customers'), routerLink: 'customers' },
                    { label: this.getLabel(menuItems, 'destinations'), routerLink: 'destinations' },
                    { label: this.getLabel(menuItems, 'drivers'), routerLink: 'drivers' },
                    { label: this.getLabel(menuItems, 'genders'), routerLink: 'genders' },
                    { label: this.getLabel(menuItems, 'pickupPoints'), routerLink: 'pickupPoints' },
                    { label: this.getLabel(menuItems, 'ports'), routerLink: 'ports' },
                    { label: this.getLabel(menuItems, 'routes'), routerLink: 'routes' },
                    { label: this.getLabel(menuItems, 'schedules'), routerLink: 'schedules' },
                    { label: this.getLabel(menuItems, 'users'), routerLink: 'users' },
                ]
            },
            {
                label: this.getLabel(menuItems, 'vessels'),
                icon: 'fas fa-ship',
                items: [
                    { label: this.getLabel(menuItems, 'vesselManagement'), routerLink: 'ships' },
                    { label: this.getLabel(menuItems, 'vesselCrews'), routerLink: 'shipCrews' },
                    { label: this.getLabel(menuItems, 'vesselOwners'), routerLink: 'shipOwners' },
                    { label: this.getLabel(menuItems, 'vesselRegistrars'), routerLink: 'shipRegistrars' },
                    { label: this.getLabel(menuItems, 'vesselRoutes'), routerLink: 'shipRoutes' },
                ]
            },
        ]
        this.bottomItems = [
            {
                label: this.getLabel(menuItems, 'logout'),
                icon: 'fas fa-power-off',
                command: (): void => {
                    this.accountService.logout()
                    idleService.stop()
                }
            }

        ]
    }

    private getLabel(response: any[], label: string): string {
        return this.messageMenuService.getDescription(response, 'menus', label)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
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
