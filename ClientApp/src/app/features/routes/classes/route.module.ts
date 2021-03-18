import { NgModule } from '@angular/core'

import { MaterialModule } from '../../../shared/modules/material.module'
import { RouteFormComponent } from '../user-interface/route-form.component'
import { RouteListComponent } from '../user-interface/route-list.component'
import { RouteRoutingModule } from './route.routing.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        RouteListComponent,
        RouteFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        RouteRoutingModule
    ]
})

export class RouteModule { }
