import { NgModule } from '@angular/core'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'
import { BoardingListComponent } from '../user-interface/boarding-list/boarding-list.component'
import { boardingListComponent } from '../user-interface/boarding-wrapper.component'
import { BoardingRoutingModule } from './boarding.routing.module'

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
