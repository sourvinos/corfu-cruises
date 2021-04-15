// Base
import { NgModule } from '@angular/core'
// Custom
import { MaterialModule } from '../../../shared/modules/material.module'
import { NationalityFormComponent } from '../user-interface/nationality-form.component'
import { NationalityListComponent } from '../user-interface/nationality-list.component'
import { NationalityRoutingModule } from './nationality.routing.module'
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
