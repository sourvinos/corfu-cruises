import { NgModule } from '@angular/core'

import { NationalityFormComponent } from '../user-interface/nationality-form.component'
import { NationalityListComponent } from '../user-interface/nationality-list.component'
import { NationalityRoutingModule } from './nationality.routing.module'
import { MaterialModule } from '../../../shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        NationalityListComponent,
        NationalityFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        NationalityRoutingModule
    ]
})

export class NationalityModule { }
