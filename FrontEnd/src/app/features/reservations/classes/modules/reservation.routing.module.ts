import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationListResolver } from '../resolvers/reservation-list.resolver'
import { ReservationFormResolver } from '../resolvers/reservation-form.resolver'
import { CalendarComponent } from '../../user-interface/calendar/calendar.component'

const routes: Routes = [
    { path: '', component: CalendarComponent, canActivate: [AuthGuardService] },
    { path: 'date/:date', component: ReservationListComponent, canActivate: [AuthGuardService], resolve: { reservationList: ReservationListResolver }, runGuardsAndResolvers: 'always' },
    { path: 'new', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { customerForm: ReservationFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReservationRoutingModule { }