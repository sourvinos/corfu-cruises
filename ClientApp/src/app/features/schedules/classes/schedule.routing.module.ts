import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CalendarWrapperComponent } from '../user-interface/list/calendar-wrapper.component'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ScheduleCreateFormComponent } from '../user-interface/form/schedule-create-form.component'

const routes: Routes = [
    { path: '', component: CalendarWrapperComponent, canActivate: [AuthGuardService] },
    { path: 'new', component: ScheduleCreateFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScheduleRoutingModule { }