import { NgModule } from '@angular/core'

import { MaterialModule } from '../../../shared/modules/material.module'
import { PickupPointFormComponent } from '../user-interface/pickupPoint-form.component'
import { PickupPointListComponent } from '../user-interface/pickupPoint-list.component'
import { PickupPointRoutingModule } from './pickupPoint.routing.module'
import { PickupPointWrapperComponent } from '../user-interface/pickupPoint-wrapper.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        PickupPointWrapperComponent,
        PickupPointListComponent,
        PickupPointFormComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule,
        PickupPointRoutingModule
    ]
})

export class PickupPointModule { }
