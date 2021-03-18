import { NgModule } from '@angular/core'

import { ShipFormComponent } from '../user-interface/ship-form.component'
import { ShipListComponent } from '../user-interface/ship-list.component'
import { ShipRoutingModule } from './ship.routing.module'
import { MaterialModule } from '../../../shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ShipListComponent,
        ShipFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        ShipRoutingModule
    ]
})

export class ShipModule { }
