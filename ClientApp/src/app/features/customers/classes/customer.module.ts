import { NgModule } from '@angular/core'

import { CustomerFormComponent } from '../user-interface/customer-form.component'
import { CustomerListComponent } from '../user-interface/customer-list.component'
import { CustomerRoutingModule } from './customer.routing.module'
import { MaterialModule } from '../../../shared/modules/material.module'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        CustomerRoutingModule
    ]
})

export class CustomerModule { }
