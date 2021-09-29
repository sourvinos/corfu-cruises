import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { RouteFormComponent } from '../../user-interface/route-form.component'
import { RouteFormResolver } from '../resolvers/route-form.resolver'
import { RouteListComponent } from '../../user-interface/route-list.component'
import { RouteListResolver } from '../resolvers/route-list.resolver'

const routes: Routes = [
    { path: '', component: RouteListComponent, canActivate: [AuthGuardService], resolve: { routeList: RouteListResolver } },
    { path: 'new', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { routeForm: RouteFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RouteRoutingModule { }