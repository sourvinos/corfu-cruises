import { NgModule } from '@angular/core'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'
import { BoardingListComponent } from '../user-interface/main/boarding-list/boarding-list.component'
import { BoardingWrapperComponent } from '../user-interface/main/boarding-wrapper.component'
import { BoardingRoutingModule } from './boarding.routing.module'

@NgModule({
    declarations: [
        BoardingListComponent,
        BoardingWrapperComponent,

    ],
    imports: [
        MaterialModule,
        SharedModule,
        BoardingRoutingModule
    ]
})

export class BoardingModule { }
