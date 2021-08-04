import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ShipRouteFormComponent } from '../user-interface/ship-route-form.component'
import { ShipRouteFormResolver } from './shipRoute-form.resolver'
import { ShipRouteListComponent } from '../user-interface/ship-route-list.component'
import { ShipRouteListResolver } from './shipRoute-list.resolver'

const routes: Routes = [
    { path: '', component: ShipRouteListComponent, canActivate: [AuthGuardService], resolve: { shipRouteList: ShipRouteListResolver } },
    { path: 'new', component: ShipRouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ShipRouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { shipRouteForm: ShipRouteFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ShipRouteRoutingModule { }