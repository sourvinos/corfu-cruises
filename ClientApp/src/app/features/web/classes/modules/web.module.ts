import { NgModule } from '@angular/core'
// Custom
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'
import { WebPassengerFormComponent } from '../../user-interface/passenger-form/web-passenger-form.component'
import { WebPassengerListComponent } from '../../user-interface/passenger-list/web-passenger-list.component'
import { WebPassengerTableComponent } from '../../user-interface/passenger-table/web-passenger-table.component'
import { WebReservationFormComponent } from '../../user-interface/reservation-form/web-reservation-form.component'
import { WebRoutingModule } from './web.routing.module'


@NgModule({
    declarations: [
        WebReservationFormComponent,
        WebPassengerFormComponent,
        WebPassengerListComponent,
        WebPassengerTableComponent
    ],
    imports: [
        MaterialModule,
        SharedModule,
        WebRoutingModule
    ]
})

export class WebModule { }
