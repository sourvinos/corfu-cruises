import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { WebReservationFormComponent } from '../../user-interface/reservation-form/web-reservation-form.component'
import { WebReservationFormResolver } from '../resolvers/web-reservation-form.resolver'

const routes: Routes = [
    { path: '', component: WebReservationFormComponent },
    { path: ':id', component: WebReservationFormComponent, canDeactivate: [CanDeactivateGuard], resolve: { reservationForm: WebReservationFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WebRoutingModule { }