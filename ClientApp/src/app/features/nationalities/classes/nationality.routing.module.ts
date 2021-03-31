import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { NationalityFormComponent } from '../user-interface/nationality-form.component'
import { NationalityFormResolver } from './nationality-form.resolver'
import { NationalityListComponent } from '../user-interface/nationality-list.component'
import { NationalityListResolver } from './nationality-list.resolver'

const routes: Routes = [
    { path: '', component: NationalityListComponent, canActivate: [AuthGuardService], resolve: { nationalityList: NationalityListResolver } },
    { path: 'new', component: NationalityFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: NationalityFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { nationalityForm: NationalityFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NationalityRoutingModule { }