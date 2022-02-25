// Base
import { NgModule } from '@angular/core'
import { NoPreloading, RouterModule, Routes } from '@angular/router'
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
    { path: 'account', loadChildren: () => import('../features/account/classes/account.module').then(m => m.AccountModule) },
    { path: 'customers', loadChildren: () => import('../features/customers/classes/modules/customer.module').then(m => m.CustomerModule) },
    { path: 'destinations', loadChildren: () => import('../features/destinations/classes/destination.module').then(m => m.DestinationModule) },
    { path: 'drivers', loadChildren: () => import('../features/drivers/classes/driver.module').then(m => m.DriverModule) },
    { path: 'embarkation', loadChildren: () => import('../features/embarkation/classes/modules/embarkation.module').then(m => m.EmbarkationModule) },
    { path: 'genders', loadChildren: () => import('../features/genders/classes/gender.module').then(m => m.GenderModule) },
    { path: 'invoicing', loadChildren: () => import('../features/invoicing/classes/modules/invoicing.module').then(m => m.InvoicingModule) },
    { path: 'manifest', loadChildren: () => import('../features/manifest/classes/modules/manifest.module').then(m => m.ManifestModule) },
    { path: 'pickupPoints', loadChildren: () => import('../features/pickupPoints/classes/pickupPoint.module').then(m => m.PickupPointModule) },
    { path: 'ports', loadChildren: () => import('../features/ports/classes/modules/port.module').then(m => m.PortModule) },
    { path: 'reservations', loadChildren: () => import('../features/reservations/classes/modules/reservation.module').then(m => m.ReservationModule) },
    { path: 'routes', loadChildren: () => import('../features/routes/classes/modules/route.module').then(m => m.RouteModule) },
    { path: 'schedules', loadChildren: () => import('../features/schedules/classes/modules/schedule.module').then(m => m.ScheduleModule) },
    { path: 'shipCrews', loadChildren: () => import('../features/shipCrews/classes/modules/crew.module').then(m => m.CrewModule) },
    { path: 'shipOwners', loadChildren: () => import('../features/ships/owners/classes/base/ship-owner.module').then(m => m.ShipOwnerModule) },
    { path: 'shipRegistrars', loadChildren: () => import('../features/ships/registrars/classes/registrar.module').then(m => m.RegistrarModule) },
    { path: 'shipRoutes', loadChildren: () => import('../features/ships/routes/classes/modules/shipRoute.module').then(m => m.ShipRouteModule) },
    { path: 'ships', loadChildren: () => import('../features/ships/base/classes/modules/ship.module').then(m => m.ShipModule) },
    { path: 'users', loadChildren: () => import('../features/users/classes/user.module').then(m => m.UserModule) },
    { path: 'credits', component: CreditsComponent },
    { path: '**', component: EmptyPageComponent }
]

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
            preloadingStrategy: NoPreloading,
            useHash: true,
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
