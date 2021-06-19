// Base
import { NgModule } from '@angular/core'
// Custom
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
        NationalityRoutingModule
    ]
})

export class NationalityModule { }
