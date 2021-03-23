import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { BookingFormComponent } from '../user-interface/main/booking-form/booking-form.component'
import { BookingFormResolver } from './booking-form.resolver'
import { BookingListComponent } from '../user-interface/main/booking-list/booking-list.component'
import { BookingListResolver } from './booking-list.resolver'
import { BookingWrapperComponent } from '../user-interface/main/booking-wrapper.component'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'

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