import { NgModule } from '@angular/core'
// Custom
import { CalendarComponent } from '../user-interface/calendar.component'
import { MaterialModule } from '../../../shared/modules/material.module'
import { ScheduleCreateFormComponent } from '../user-interface/schedule-create-form.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { ScheduleWrapperComponent } from '../user-interface/schedule-wrapper.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ScheduleWrapperComponent,
        ScheduleCreateFormComponent,
        CalendarComponent
    ],
    imports: [
        MaterialModule,
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
