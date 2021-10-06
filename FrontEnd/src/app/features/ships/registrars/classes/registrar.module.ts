import { NgModule } from '@angular/core'
// Custom
import { RegistrarFormComponent } from '../user-interface/registrar-form.component'
import { RegistrarListComponent } from '../user-interface/registrar-list.component'
import { RegistrarRoutingModule } from './registrar.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        RegistrarListComponent,
        RegistrarFormComponent
    ],
    imports: [
        SharedModule,
        RegistrarRoutingModule
    ]
})

export class RegistrarModule { }
