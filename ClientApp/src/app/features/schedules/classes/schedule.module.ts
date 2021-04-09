import { NgModule } from '@angular/core'

import { MaterialModule } from '../../../shared/modules/material.module'
import { ScheduleCreateFormComponent } from '../user-interface/schedule-create-form.component'
import { ScheduleListComponent } from '../user-interface/schedule-list.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { ScheduleWrapperComponent } from '../user-interface/schedule-wrapper.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ScheduleWrapperComponent,
        ScheduleListComponent,
        ScheduleCreateFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        ScheduleRoutingModule
    ]
})

export class ScheduleModule { }
