import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { BookingFormResolver } from './booking-form.resolver'
import { BookingListResolver } from './booking-list.resolver'
import { BookingWrapperComponent } from '../user-interface/booking-wrapper/booking-wrapper.component'
import { BookingListComponent } from '../user-interface/booking-wrapper/booking-list/booking-list.component'
import { BookingFormComponent } from '../user-interface/booking-wrapper/booking-form/booking-form.component'

const routes: Routes = [
    {
        path: '', component: BookingWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:dateIn', component: BookingListComponent, canActivate: [AuthGuardService], resolve: { bookingList: BookingListResolver }, children: [
                    { path: 'booking/new', component: BookingFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
                    { path: 'booking/:id', component: BookingFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { bookingForm: BookingFormResolver } }
                ], runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingRoutingModule { }