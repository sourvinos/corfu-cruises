import { NgModule } from '@angular/core'

import { DestinationFormComponent } from '../user-interface/destination-form.component'
import { DestinationListComponent } from '../user-interface/destination-list.component'
import { DestinationRoutingModule } from './destination.routing.module'
import { MaterialModule } from '../../../shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        DestinationRoutingModule
    ]
})

export class DestinationModule { }
