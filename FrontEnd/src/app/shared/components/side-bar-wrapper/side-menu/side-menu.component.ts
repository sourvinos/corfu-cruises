import idleService from '@kurtz1993/idle-service'
import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api/menuitem'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from '../../../services/account.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageMenuService } from '../../../services/messages-menu.service'
import { Router } from '@angular/router'

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
                label: this.getLabel(menuItems, 'passengers'),
                icon: 'fas fa-users',
                items: [
                    { label: this.getLabel(menuItems, 'embarkation'), command: (): void => { this.router.navigate(['/']) } },
                    { label: this.getLabel(menuItems, 'manifest'), command: (): void => { this.router.navigate(['/']) } },
                ]
            },
            {
                label: this.getLabel(menuItems, 'reservations'),
                icon: 'fab fa-buffer',
                items: [
                    { label: this.getLabel(menuItems, 'dashboard'), command: (): void => { this.router.navigate(['/reservations']) } },
                    { label: this.getLabel(menuItems, 'invoicing'), command: (): void => { this.router.navigate(['/']) } },
                ]
            },
            {
                label: this.getLabel(menuItems, 'tables'),
                icon: 'fas fa-table',
                items: [
                    { label: this.getLabel(menuItems, 'customers'), command: (): void => { this.router.navigate(['/customers']) } },
                    { label: this.getLabel(menuItems, 'destinations'), command: (): void => { this.router.navigate(['/destinations']) } },
                    { label: this.getLabel(menuItems, 'drivers'), command: (): void => { this.router.navigate(['/drivers']) } },
                    { label: this.getLabel(menuItems, 'pickupPoints'), command: (): void => { this.router.navigate(['/pickupPoints']) } },
                    { label: this.getLabel(menuItems, 'coachRoutes'), command: (): void => { this.router.navigate(['/routes']) } },
                    { label: this.getLabel(menuItems, 'ports'), command: (): void => { this.router.navigate(['/ports']) } },
                    { label: this.getLabel(menuItems, 'schedules'), command: (): void => { this.router.navigate(['/schedules']) } },
                    { label: this.getLabel(menuItems, 'ships'), command: (): void => { this.router.navigate(['/ships']) } },
                    { label: this.getLabel(menuItems, 'crews'), command: (): void => { this.router.navigate(['/shipCrews']) } },
                    { label: this.getLabel(menuItems, 'genders'), command: (): void => { this.router.navigate(['/genders']) } },
                    { label: this.getLabel(menuItems, 'registrars'), command: (): void => { this.router.navigate(['/shipRegistrars']) } },
                    { label: this.getLabel(menuItems, 'shipOwners'), command: (): void => { this.router.navigate(['/shipOwners']) } },
                    { label: this.getLabel(menuItems, 'shipRoutes'), command: (): void => { this.router.navigate(['/shipRoutes']) } },
                    { label: this.getLabel(menuItems, 'users'), command: (): void => { this.router.navigate(['/users']) } }
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
