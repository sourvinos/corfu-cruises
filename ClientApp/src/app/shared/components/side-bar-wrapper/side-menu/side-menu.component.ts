import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Observable } from 'rxjs'
// Custom
import { AccountService } from '../../../services/account.service'
import { MessageMenuService } from '../../../services/messages-menu.service'

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent {

    //#region variables

    private feature = 'main-menu'
    private userRole: Observable<string>
    public bottomItems: MenuItem[]
    public loginStatus: Observable<boolean>
    public topItems: MenuItem[]

    //#endregion

    constructor(private accountService: AccountService, private messageMenuService: MessageMenuService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.buildMenu()
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region private methods

    private buildMenu(): void {
        this.topItems = [
            {
                label: 'Home',
                icon: 'pi pi-pw pi-home',
                routerLink: ['/']
            },
            {
                label: 'Passengers',
                items: [
                    { label: 'Embarkation', routerLink: '/boarding' },
                    { label: 'Ship Manifest', routerLink: '/manifest' }
                ]
            },
            {
                label: 'Reservations',
                items: [
                    { label: 'Dashboard', routerLink: 'reservations' },
                    { label: 'Invoicing', routerLink: 'invoicing' }
                ]
            },
            {
                label: 'Tables',
                items: [
                    { label: 'Customers', routerLink: 'customers' },
                    { label: 'Destinations', routerLink: 'destinations' },
                    { label: 'Drivers', routerLink: 'drivers' },
                    { label: 'Genders', routerLink: 'genders' },
                    { label: 'Pickup points', routerLink: 'pickupPoints' },
                    { label: 'Ports', routerLink: 'ports' },
                    { label: 'Routes', routerLink: 'routes' },
                    { label: 'Schedules', routerLink: 'schedules' }
                ]
            },
            {
                label: 'Users',
                icon: 'pi pi-pw pi-users',
                routerLink: 'users'
            },
            {
                label: 'Vessels',
                icon: 'pi pi-pw pi-shield',
                routerLink: ''
            },
        ]
        this.bottomItems = [
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-power-off'
            }

        ]
    }

    private getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.feature, id)
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
        this.userRole = this.accountService.currentUserRole
    }

    //#endregion

    //#region getters

    get isConnectedUserAdmin(): boolean {
        let isAdmin = false
        this.userRole.subscribe(result => {
            isAdmin = result == 'Admin' ? true : false
        })
        return isAdmin
    }

    //#endregion

}
