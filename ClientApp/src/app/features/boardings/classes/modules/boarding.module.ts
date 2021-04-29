import { NgModule } from '@angular/core'
// Custom
import { BoardingListComponent } from '../../user-interface/boarding-list/boarding-list.component'
import { BoardingRoutingModule } from './boarding.routing.module'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { boardingListComponent } from '../../user-interface/boarding-wrapper/boarding-wrapper.component'

@NgModule({
    declarations: [
        BoardingListComponent,
        boardingListComponent,

    ],
    imports: [
        MaterialModule,
        SharedModule,
        BoardingRoutingModule
    ]
})

export class BoardingModule { }
