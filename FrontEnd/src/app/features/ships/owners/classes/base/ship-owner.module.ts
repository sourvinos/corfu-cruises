import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from 'src/app/shared/modules/shared.module'
import { ShipOwnerFormComponent } from '../../user-interface/ship-owner-form.component'
import { ShipOwnerListComponent } from '../../user-interface/ship-owner-list.component'
import { ShipOwnerRoutingModule } from './ship-owner.routing.module'

@NgModule({
    declarations: [
        ShipOwnerListComponent,
        ShipOwnerFormComponent
    ],
    imports: [
        SharedModule,
        ShipOwnerRoutingModule
    ]
})

export class ShipOwnerModule { }
