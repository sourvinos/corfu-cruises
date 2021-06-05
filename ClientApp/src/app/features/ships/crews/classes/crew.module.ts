import { NgModule } from '@angular/core'
// Custom
import { CrewFormComponent } from '../user-interface/crew-form.component'
import { CrewListComponent } from '../user-interface/crew-list.component'
import { CrewRoutingModule } from './crew.routing.module'
import { MaterialModule } from '../../../../shared/modules/material.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        CrewListComponent,
        CrewFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        CrewRoutingModule
    ]
})

export class CrewModule { }
