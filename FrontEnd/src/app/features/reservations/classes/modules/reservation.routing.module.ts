import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CalendarComponent } from '../../user-interface/calendar/calendar.component'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'
import { ReservationFormResolver } from '../resolvers/reservation-form.resolver'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationListResolverByDate } from '../resolvers/reservation-list.resolver-by-date'
import { ReservationListResolverByRefNo } from '../resolvers/reservation-list.resolver-by-refNo'

const routes: Routes = [
    { path: '', component: CalendarComponent, canActivate: [AuthGuardService] },
    { path: 'byDate/:date', component: ReservationListComponent, canActivate: [AuthGuardService], resolve: { reservationList: ReservationListResolverByDate }, runGuardsAndResolvers: 'always' },
    { path: 'byRefNo/:refNo', component: ReservationListComponent, canActivate: [AuthGuardService], resolve: { reservationList: ReservationListResolverByRefNo }, runGuardsAndResolvers: 'always' },
    { path: 'new', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { reservationForm: ReservationFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReservationRoutingModule { }