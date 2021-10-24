import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CalendarWrapperComponent } from '../../user-interface/calendar/calendar-wrapper.component'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { EditScheduleComponent } from '../../user-interface/edit/edit-schedule.component'
import { NewScheduleComponent } from '../../user-interface/new/new-schedule.component'
import { ScheduleEditFormResolver } from '../resolvers/schedule-edit-form.resolver'
import { ScheduleListComponent } from '../../user-interface/list/schedule-list.component'
import { ScheduleListResolver } from '../resolvers/schedule-list.resolver'

const routes: Routes = [
    { path: '', component: CalendarWrapperComponent, canActivate: [AuthGuardService] },
    { path: 'new', component: NewScheduleComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'list', component: ScheduleListComponent, canActivate: [AuthGuardService], resolve: { scheduleList: ScheduleListResolver } },
    { path: 'list/:id', component: EditScheduleComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { scheduleEditForm: ScheduleEditFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScheduleRoutingModule { }