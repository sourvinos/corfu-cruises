import { NgModule } from '@angular/core'
// Custom
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
        RouteRoutingModule
    ]
})

export class RouteModule { }
