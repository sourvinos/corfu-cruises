import { NgModule } from '@angular/core'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'
// Custom
import { ShipOwnerFormComponent } from '../user-interface/ship-owner-form.component'
import { ShipOwnerListComponent } from '../user-interface/ship-owner-list.component'
import { ShipOwnerRoutingModule } from './ship-owner.routing.module'

@NgModule({
    declarations: [
        ShipOwnerListComponent,
        ShipOwnerFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        ShipOwnerRoutingModule
    ]
})

export class ShipOwnerModule { }
