import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { CrewFormComponent } from '../user-interface/crew-form.component'
import { CrewFormResolver } from './crew-form.resolver'
import { CrewListComponent } from '../user-interface/crew-list.component'
import { CrewListResolver } from './crew-list.resolver'

const routes: Routes = [
    { path: '', component: CrewListComponent, canActivate: [AuthGuardService], resolve: { crewList: CrewListResolver } },
    { path: 'new', component: CrewFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: CrewFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { crewForm: CrewFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CrewRoutingModule { }