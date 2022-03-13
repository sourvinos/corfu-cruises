import idleService from '@kurtz1993/idle-service'
import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api/menuitem'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from '../../../services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
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
    public bottomItems: MenuItem[]
    public loginStatus: Observable<boolean>
    public topItems: MenuItem[]

    //#endregion

    constructor(private accountService: AccountService, private helperService: HelperService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router) { }

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
                label: this.getLabel(menuItems, 'embarkation'), command: (): void => { this.router.navigate(['/embarkation']) },
                icon: 'fas fa-ship'
            },
            {
                label: this.getLabel(menuItems, 'reservations'), command: (): void => { this.router.navigate(['/reservations']) },
                icon: 'fas fa-ticket-alt'
            },
            {
                label: this.getLabel(menuItems, 'tasks'),
                icon: 'fas fa-microchip',
                items: [
                    { label: this.getLabel(menuItems, 'invoicing', true), command: (): void => { this.router.navigate([this.helperService.getHomePage()]) } },
                    { label: this.getLabel(menuItems, 'manifest', true), command: (): void => { this.router.navigate([this.helperService.getHomePage()]) } },
                ]
            },
            {
                label: this.getLabel(menuItems, 'tables'),
                icon: 'fas fa-list-alt',
                items: [
                    { label: this.getLabel(menuItems, 'customers', true), command: (): void => { this.router.navigate(['/customers']) } },
                    { label: this.getLabel(menuItems, 'destinations', true), command: (): void => { this.router.navigate(['/destinations']) } },
                    { label: this.getLabel(menuItems, 'drivers', true), command: (): void => { this.router.navigate(['/drivers']) } },
                    { label: this.getLabel(menuItems, 'pickupPoints', true), command: (): void => { this.router.navigate(['/pickupPoints']) } },
                    { label: this.getLabel(menuItems, 'coachRoutes', true), command: (): void => { this.router.navigate(['/routes']) } },
                    { label: this.getLabel(menuItems, 'ports', true), command: (): void => { this.router.navigate(['/ports']) } },
                    { label: this.getLabel(menuItems, 'schedules', true), command: (): void => { this.router.navigate(['/schedules']) } },
                    { label: this.getLabel(menuItems, 'ships', true), command: (): void => { this.router.navigate(['/ships']) } },
                    { label: this.getLabel(menuItems, 'crews', true), command: (): void => { this.router.navigate(['/crews']) } },
                    { label: this.getLabel(menuItems, 'genders', true), command: (): void => { this.router.navigate(['/genders']) } },
                    { label: this.getLabel(menuItems, 'registrars', true), command: (): void => { this.router.navigate(['/registrars']) } },
                    { label: this.getLabel(menuItems, 'shipOwners', true), command: (): void => { this.router.navigate(['/shipOwners']) } },
                    { label: this.getLabel(menuItems, 'shipRoutes', true), command: (): void => { this.router.navigate(['/shipRoutes']) } },
                    { label: this.getLabel(menuItems, 'users', true), command: (): void => { this.router.navigate(['/users']) } }
                ]
            }
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

    private getLabel(response: any[], label: string, showIcon = false): string {
        return showIcon ? this.getIcon() + this.messageMenuService.getDescription(response, 'menus', label) : this.messageMenuService.getDescription(response, 'menus', label)
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

    private getIcon(): string {
        return '◻️ '
    }

    //#endregion

}
