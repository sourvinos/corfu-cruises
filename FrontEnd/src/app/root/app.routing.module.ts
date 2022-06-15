// Base
import { NgModule } from '@angular/core'
import { NoPreloading, RouterModule, Routes } from '@angular/router'
// Components
import { AvailabilityComponent } from '../features/availability/user-interface/availability.component'
import { CreditsComponent } from '../features/credits/user-interface/credits.component'
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component'
import { ForgotPasswordFormComponent } from '../features/users/user-interface/forgot-password/forgot-password-form.component'
import { HomeComponent } from '../features/home/home.component'
import { LoginFormComponent } from '../features/login/user-interface/login-form.component'
import { ResetPasswordFormComponent } from '../features/users/user-interface/reset-password/reset-password-form.component'
import { TotalsComponent } from '../features/reservations/user-interface/totals/totals.component'
// Guards
import { AuthGuardService } from '../shared/services/auth-guard.service'

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'availability', component: AvailabilityComponent, canActivate: [AuthGuardService] },
    { path: 'totals', component: TotalsComponent, canActivate: [AuthGuardService] },
    { path: 'coachRoutes', loadChildren: () => import('../features/coachRoutes/classes/modules/coachRoute.module').then(m => m.CoachRouteModule) },
    { path: 'crews', loadChildren: () => import('../features/crews/classes/modules/crew.module').then(m => m.CrewModule) },
    { path: 'customers', loadChildren: () => import('../features/customers/classes/modules/customer.module').then(m => m.CustomerModule) },
    { path: 'destinations', loadChildren: () => import('../features/destinations/classes/modules/destination.module').then(m => m.DestinationModule) },
    { path: 'drivers', loadChildren: () => import('../features/drivers/classes/modules/driver.module').then(m => m.DriverModule) },
    { path: 'embarkation', loadChildren: () => import('../features/embarkation/classes/modules/embarkation.module').then(m => m.EmbarkationModule) },
    { path: 'genders', loadChildren: () => import('../features/genders/classes/modules/gender.module').then(m => m.GenderModule) },
    { path: 'invoicing', loadChildren: () => import('../features/invoicing/classes/modules/invoicing.module').then(m => m.InvoicingModule) },
    { path: 'manifest', loadChildren: () => import('../features/manifest/classes/modules/manifest.module').then(m => m.ManifestModule) },
    { path: 'pickupPoints', loadChildren: () => import('../features/pickupPoints/classes/modules/pickupPoint.module').then(m => m.PickupPointModule) },
    { path: 'ports', loadChildren: () => import('../features/ports/classes/modules/port.module').then(m => m.PortModule) },
    { path: 'registrars', loadChildren: () => import('../features/registrars/classes/modules/registrar.module').then(m => m.RegistrarModule) },
    { path: 'reservations', loadChildren: () => import('../features/reservations/classes/modules/reservation.module').then(m => m.ReservationModule) },
    { path: 'schedules', loadChildren: () => import('../features/schedules/classes/modules/schedule.module').then(m => m.ScheduleModule) },
    { path: 'shipOwners', loadChildren: () => import('../features/shipOwners/classes/modules/shipOwner.module').then(m => m.ShipOwnerModule) },
    { path: 'shipRoutes', loadChildren: () => import('../features/shipRoutes/classes/modules/shipRoute.module').then(m => m.ShipRouteModule) },
    { path: 'ships', loadChildren: () => import('../features/ships/classes/modules/ship.module').then(m => m.ShipModule) },
    { path: 'users', loadChildren: () => import('../features/users/classes/modules/user.module').then(m => m.UserModule) },
    { path: 'forgotPassword', component: ForgotPasswordFormComponent },
    { path: 'resetPassword', component: ResetPasswordFormComponent },
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
