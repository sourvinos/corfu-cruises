import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ScheduleCreateFormComponent } from '../user-interface/schedule-create-form.component'
import { ScheduleListComponent } from '../user-interface/schedule-list.component'
import { ScheduleListResolver } from './schedule-list.resolver'

const routes: Routes = [
    { path: '', component: ScheduleListComponent, canActivate: [AuthGuardService], resolve: { ScheduleList: ScheduleListResolver } },
    { path: 'new', component: ScheduleCreateFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScheduleRoutingModule { }