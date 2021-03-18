import { NgModule } from '@angular/core'

import { BookingAssignDriverComponent } from '../user-interface/assign-driver/assign-driver-form.component'
import { BookingFormComponent } from '../user-interface/booking-wrapper/booking-form/booking-form.component'
import { BookingListComponent } from '../user-interface/booking-wrapper/booking-list/booking-list.component'
import { BookingRoutingModule } from './booking.routing.module'
import { BookingWrapperComponent } from '../user-interface/booking-wrapper/booking-wrapper.component'
import { MaterialModule } from '../../../shared/modules/material.module'
import { PassengerFormComponent } from '../user-interface/booking-wrapper/booking-form/passenger-list/passenger-form/passenger-form.component'
import { PassengerListComponent } from '../user-interface/booking-wrapper/booking-form/passenger-list/passenger-list.component'
import { PassengerTableComponent } from '../user-interface/booking-wrapper/booking-form/passenger-list/passenger-table.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        BookingAssignDriverComponent,
        BookingFormComponent,
        BookingListComponent,
        BookingWrapperComponent,
        PassengerFormComponent,
        PassengerListComponent,
        PassengerTableComponent
    ],
    imports: [
        MaterialModule,
        SharedModule,
        BookingRoutingModule
    ],
    entryComponents: [
        BookingAssignDriverComponent
    ]
})

export class BookingModule { }
