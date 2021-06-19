import { NgModule } from '@angular/core'
// Custom
import { CalendarComponent } from '../user-interface/calendar.component'
import { CalendarLegendComponent } from '../user-interface/calendar-legend.component'
import { ScheduleCreateFormComponent } from '../user-interface/schedule-create-form.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { ScheduleWrapperComponent } from '../user-interface/schedule-wrapper.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ScheduleWrapperComponent,
        ScheduleCreateFormComponent,
        CalendarComponent,
        CalendarLegendComponent
    ],
    imports: [
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
