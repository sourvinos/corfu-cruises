import { NgModule } from '@angular/core'
// Custom
import { PassengerFormComponent } from '../../user-interface/passenger-form/passenger-form.component'
import { PassengerListComponent } from '../../user-interface/passenger-list/passenger-list.component'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationRoutingModule } from './reservation.routing.module'
import { ReservationToDriverComponent } from './../../user-interface/reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToVesselComponent } from '../../user-interface/reservation-to-vessel/reservation-to-vessel-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { SummaryComponent } from '../../user-interface/reservation-list/summary-block.component'
import { CalendarComponent } from '../../user-interface/calendar/calendar.component'

@NgModule({
    declarations: [
        CalendarComponent,
        PassengerFormComponent,
        PassengerListComponent,
        ReservationFormComponent,
        ReservationListComponent,
        ReservationToDriverComponent,
        ReservationToVesselComponent,
        SummaryComponent
    ],
    imports: [
        SharedModule,
        ReservationRoutingModule
    ],
    entryComponents: [
        ReservationToDriverComponent,
        ReservationToVesselComponent
    ]
})

export class ReservationModule { }
