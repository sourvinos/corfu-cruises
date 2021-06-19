import { NgModule } from '@angular/core'
// Custom
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
        PickupPointRoutingModule
    ]
})

export class PickupPointModule { }
