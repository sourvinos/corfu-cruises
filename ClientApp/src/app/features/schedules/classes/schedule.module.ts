import { NgModule } from '@angular/core'
// Custom
import { ScheduleRoutingModule } from './schedule.routing.module'
import { SharedModule } from '../../../shared/modules/shared.module'
import { CalendarWrapperComponent } from '../user-interface/calendar/calendar-wrapper.component'
import { ScheduleCreateFormComponent } from '../user-interface/form/schedule-create-form.component'
import { CalendarComponent } from '../user-interface/calendar/calendar.component'

@NgModule({
    declarations: [
        CalendarWrapperComponent,
        ScheduleCreateFormComponent,
        CalendarComponent
    ],
    imports: [
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
