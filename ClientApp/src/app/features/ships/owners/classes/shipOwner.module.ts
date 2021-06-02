import { NgModule } from '@angular/core'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'
// Custom
import { ShipOwnerFormComponent } from './../user-interface/shipOwner-form.component'
import { ShipOwnerListComponent } from '../user-interface/shipOwner-list.component'
import { ShipOwnerRoutingModule } from './shipOwner.routing.module'

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
