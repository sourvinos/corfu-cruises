import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ShipOwnerFormComponent } from '../user-interface/shipOwner-form.component'
import { ShipOwnerListComponent } from '../user-interface/ShipOwner-list.component'
import { ShipOwnerFormResolver } from './shipOwner-form.resolver'
import { ShipOwnerListResolver } from './shipOwner-list.resolver'

const routes: Routes = [
    { path: '', component: ShipOwnerListComponent, canActivate: [AuthGuardService], resolve: { shipOwnerList: ShipOwnerListResolver } },
    { path: 'new', component: ShipOwnerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ShipOwnerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { shipOwnerForm: ShipOwnerFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ShipOwnerRoutingModule { }