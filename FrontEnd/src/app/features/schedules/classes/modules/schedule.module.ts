import { NgModule } from '@angular/core'
// Custom
import { EditScheduleComponent } from '../../user-interface/edit/edit-schedule.component'
import { NewScheduleComponent } from '../../user-interface/new/new-schedule.component'
import { ScheduleListComponent } from '../../user-interface/list/schedule-list.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ScheduleListComponent,
        NewScheduleComponent,
        EditScheduleComponent,
    ],
    imports: [
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
