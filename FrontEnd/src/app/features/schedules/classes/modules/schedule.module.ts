import { NgModule } from '@angular/core'
// Custom
import { CalendarComponent } from '../../user-interface/calendar/calendar.component'
import { EditScheduleComponent } from '../../user-interface/edit/edit-schedule.component'
import { NewScheduleComponent } from '../../user-interface/new/new-schedule.component'
import { ScheduleListComponent } from '../../user-interface/list/schedule-list.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        CalendarComponent,
        ScheduleListComponent,
        NewScheduleComponent,
        EditScheduleComponent,
        CalendarComponent
    ],
    imports: [
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
