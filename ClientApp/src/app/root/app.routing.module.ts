// Base
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// Components
import { CreditsComponent } from '../features/credits/user-interface/credits.component'
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component'
import { HomeComponent } from '../features/home/home.component'
import { LoginFormComponent } from '../features/login/user-interface/login-form.component'

// Guards
import { AuthGuardService } from '../shared/services/auth-guard.service'

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'account', loadChildren: (): any => import('../features/account/classes/account.module').then(m => m.AccountModule) },
    { path: 'boarding', loadChildren: (): any => import('../features/boardings/classes/modules/boarding.module').then(m => m.BoardingModule) },
    { path: 'customers', loadChildren: (): any => import('../features/customers/classes/customer.module').then(m => m.CustomerModule) },
    { path: 'destinations', loadChildren: (): any => import('../features/destinations/classes/destination.module').then(m => m.DestinationModule) },
    { path: 'drivers', loadChildren: (): any => import('../features/drivers/classes/driver.module').then(m => m.DriverModule) },
    { path: 'genders', loadChildren: (): any => import('../features/genders/classes/gender.module').then(m => m.GenderModule) },
    { path: 'invoicing', loadChildren: (): any => import('../features/invoicing/classes/modules/invoicing.module').then(m => m.InvoicingModule) },
    { path: 'manifest', loadChildren: (): any => import('../features/manifest/classes/modules/manifest.module').then(m => m.ManifestModule) },
    { path: 'nationalities', loadChildren: (): any => import('../features/nationalities/classes/nationality.module').then(m => m.NationalityModule) },
    { path: 'pickupPoints', loadChildren: (): any => import('../features/pickupPoints/classes/pickupPoint.module').then(m => m.PickupPointModule) },
    { path: 'ports', loadChildren: (): any => import('../features/ports/classes/port.module').then(m => m.PortModule) },
    { path: 'registrars', loadChildren: (): any => import('../features/ships/registrars/classes/registrar.module').then(m => m.RegistrarModule) },
    { path: 'reservations', loadChildren: (): any => import('../features/reservations/classes/modules/reservation.module').then(m => m.ReservationModule) },
    { path: 'routes', loadChildren: (): any => import('../features/routes/classes/route.module').then(m => m.RouteModule) },
    { path: 'schedules', loadChildren: (): any => import('../features/schedules/classes/schedule.module').then(m => m.ScheduleModule) },
    { path: 'shipOwners', loadChildren: (): any => import('../features/ships/owners/classes/ship-owner.module').then(m => m.ShipOwnerModule) },
    { path: 'shipRoutes', loadChildren: (): any => import('../features/ships/routes/classes/shipRoute.module').then(m => m.ShipRouteModule) },
    { path: 'ships', loadChildren: (): any => import('../features/ships/base/classes/ship.module').then(m => m.ShipModule) },
    { path: 'users', loadChildren: (): any => import('../features/users/classes/user.module').then(m => m.UserModule) },
    { path: 'web', loadChildren: (): any => import('../features/web/classes/modules/web.module').then(m => m.WebModule) },
    { path: 'credits', component: CreditsComponent },
    { path: '**', component: EmptyPageComponent }
]

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
