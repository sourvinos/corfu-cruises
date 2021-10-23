// Base
import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

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
    { path: 'embarkation', loadChildren: (): any => import('../features/embarkation/classes/modules/embarkation.module').then(m => m.EmbarkationModule) },
    { path: 'customers', loadChildren: (): any => import('../features/customers/classes/modules/customer.module').then(m => m.CustomerModule) },
    { path: 'destinations', loadChildren: (): any => import('../features/destinations/classes/destination.module').then(m => m.DestinationModule) },
    { path: 'drivers', loadChildren: (): any => import('../features/drivers/classes/driver.module').then(m => m.DriverModule) },
    { path: 'genders', loadChildren: (): any => import('../features/genders/classes/gender.module').then(m => m.GenderModule) },
    { path: 'invoicing', loadChildren: (): any => import('../features/invoicing/classes/modules/invoicing.module').then(m => m.InvoicingModule) },
    { path: 'manifest', loadChildren: (): any => import('../features/manifest/classes/modules/manifest.module').then(m => m.ManifestModule) },
    { path: 'pickupPoints', loadChildren: (): any => import('../features/pickupPoints/classes/pickupPoint.module').then(m => m.PickupPointModule) },
    { path: 'ports', loadChildren: (): any => import('../features/ports/classes/modules/port.module').then(m => m.PortModule) },
    { path: 'reservations', loadChildren: (): any => import('../features/reservations/classes/modules/reservation.module').then(m => m.ReservationModule) },
    { path: 'routes', loadChildren: (): any => import('../features/routes/classes/modules/route.module').then(m => m.RouteModule) },
    { path: 'schedules', loadChildren: (): any => import('../features/schedules/classes/modules/schedule.module').then(m => m.ScheduleModule) },
    { path: 'shipCrews', loadChildren: (): any => import('../features/ships/crews/classes/crew.module').then(m => m.CrewModule) },
    { path: 'shipOwners', loadChildren: (): any => import('../features/ships/owners/classes/base/ship-owner.module').then(m => m.ShipOwnerModule) },
    { path: 'shipRegistrars', loadChildren: (): any => import('../features/ships/registrars/classes/registrar.module').then(m => m.RegistrarModule) },
    { path: 'shipRoutes', loadChildren: (): any => import('../features/ships/routes/classes/modules/shipRoute.module').then(m => m.ShipRouteModule) },
    { path: 'ships', loadChildren: (): any => import('../features/ships/base/classes/modules/ship.module').then(m => m.ShipModule) },
    { path: 'users', loadChildren: (): any => import('../features/users/classes/user.module').then(m => m.UserModule) },
    { path: 'credits', component: CreditsComponent },
    { path: '**', component: EmptyPageComponent }
]

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
