import { NgModule } from '@angular/core'
// Custom
import {  ShipRouteFormComponent } from '../user-interface/ship-route-form.component'
import {  ShipRouteListComponent } from '../user-interface/ship-route-list.component'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { ShipRouteRoutingModule } from './shipRoute.routing.module'

@NgModule({
    declarations: [
        ShipRouteListComponent,
        ShipRouteFormComponent
    ],
    imports: [
        SharedModule,
        ShipRouteRoutingModule
    ]
})

export class ShipRouteModule { }
