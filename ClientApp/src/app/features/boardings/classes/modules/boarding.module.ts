import { NgModule } from '@angular/core'
// Custom
import { BoardingListComponent } from '../../user-interface/boarding-list/boarding-list.component'
import { BoardingRoutingModule } from './boarding.routing.module'
import { BoardingWrapperComponent } from '../../user-interface/boarding-wrapper/boarding-wrapper.component'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        BoardingWrapperComponent,
        BoardingListComponent,

    ],
    imports: [
        MaterialModule,
        SharedModule,
        BoardingRoutingModule
    ]
})

export class BoardingModule { }
