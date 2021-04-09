import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ScheduleCreateFormComponent } from '../user-interface/schedule-create-form.component'
import { ScheduleListComponent } from '../user-interface/schedule-list.component'
import { ScheduleListResolver } from './schedule-list.resolver'
import { ScheduleWrapperComponent } from '../user-interface/schedule-wrapper.component'

const routes: Routes = [
    {
        path: '', component: ScheduleWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'destinationId/:destinationId/portId/:portId', component: ScheduleListComponent, canActivate: [AuthGuardService], resolve: { reservationList: ScheduleListResolver }, children: [
                    { path: 'destinationId/:destinationId/portId/:portId/new', component: ScheduleCreateFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
                ], runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScheduleRoutingModule { }