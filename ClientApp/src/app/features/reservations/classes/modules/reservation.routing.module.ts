import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { ReservationFormResolver } from '../resolvers/reservation-form.resolver'

import { ReservationListResolver } from '../resolvers/reservation-list.resolver'

import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ReservationWrapperComponent } from '../../user-interface/reservation-wrapper/reservation-wrapper.component'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'

const routes: Routes = [
    {
        path: '', component: ReservationWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:dateIn', component: ReservationListComponent, canActivate: [AuthGuardService], resolve: { reservationList: ReservationListResolver }, children: [
                    { path: 'reservation/new', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
                    { path: 'reservation/:id', component: ReservationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { reservationForm: ReservationFormResolver } }
                ], runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReservationRoutingModule { }