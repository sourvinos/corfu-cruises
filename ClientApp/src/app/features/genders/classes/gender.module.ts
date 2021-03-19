import { NgModule } from '@angular/core'

import { GenderFormComponent } from '../user-interface/gender-form.component'
import { GenderListComponent } from '../user-interface/gender-list.component'
import { GenderRoutingModule } from './gender.routing.module'
import { MaterialModule } from '../../../shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        GenderListComponent,
        GenderFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        GenderRoutingModule
    ]
})

export class GenderModule { }
