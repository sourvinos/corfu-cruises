import { NgModule } from '@angular/core'

import { ReservationToDriverComponent } from './../../user-interface/reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToVesselComponent } from '../../user-interface/reservation-to-vessel/reservation-to-vessel-form.component'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationWrapperComponent } from '../../user-interface/reservation-wrapper/reservation-wrapper.component'
import { MaterialModule } from '../../../../shared/modules/material.module'
import { PassengerFormComponent } from '../../user-interface/passenger-form/passenger-form.component'
import { PassengerListComponent } from '../../user-interface/passenger-list/passenger-list.component'
import { PassengerTableComponent } from '../../user-interface/passenger-table/passenger-table.component'
import { ReservationRoutingModule } from './reservation.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ReservationToDriverComponent,
        ReservationToVesselComponent,
        ReservationFormComponent,
        ReservationListComponent,
        ReservationWrapperComponent,
        PassengerFormComponent,
        PassengerListComponent,
        PassengerTableComponent
    ],
    imports: [
        MaterialModule,
        SharedModule,
        ReservationRoutingModule
    ],
    entryComponents: [
        ReservationToDriverComponent,
        ReservationToVesselComponent
    ]
})

export class ReservationModule { }
