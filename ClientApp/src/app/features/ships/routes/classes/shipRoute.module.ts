import { NgModule } from '@angular/core'
// Custom
import {  ShipRouteFormComponent } from '../user-interface/shipRoute-form.component'
import {  ShipRouteListComponent } from '../user-interface/shipRoute-list.component'
import { MaterialModule } from '../../../../shared/modules/material.module'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { ShipRouteRoutingModule } from './shipRoute.routing.module'

@NgModule({
    declarations: [
        ShipRouteListComponent,
        ShipRouteFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        ShipRouteRoutingModule
    ]
})

export class ShipRouteModule { }
