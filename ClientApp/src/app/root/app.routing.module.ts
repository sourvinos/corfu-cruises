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
    { path: 'bookings', loadChildren: (): any => import('../features/bookings/classes/booking.module').then(m => m.BookingModule) },
    { path: 'customers', loadChildren: (): any => import('../features/customers/classes/customer.module').then(m => m.CustomerModule) },
    { path: 'destinations', loadChildren: (): any => import('../features/destinations/classes/destination.module').then(m => m.DestinationModule) },
    { path: 'drivers', loadChildren: (): any => import('../features/drivers/classes/driver.module').then(m => m.DriverModule) },
    { path: 'pickupPoints', loadChildren: (): any => import('../features/pickupPoints/classes/pickupPoint.module').then(m => m.PickupPointModule) },
    { path: 'ports', loadChildren: (): any => import('../features/ports/classes/port.module').then(m => m.PortModule) },
    { path: 'routes', loadChildren: (): any => import('../features/routes/classes/route.module').then(m => m.RouteModule) },
    { path: 'ships', loadChildren: (): any => import('../features/ships/classes/ship.module').then(m => m.ShipModule) },
    { path: 'schedules', loadChildren: (): any => import('../features/schedules/classes/schedule.module').then(m => m.ScheduleModule) },
    { path: 'users', loadChildren: (): any => import('../features/users/classes/user.module').then(m => m.UserModule) },
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
