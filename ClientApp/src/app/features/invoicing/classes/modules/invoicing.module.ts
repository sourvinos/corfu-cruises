import { NgModule } from '@angular/core'

import { MaterialModule } from '../../../../shared/modules/material.module'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { InvoicingListComponent } from '../../user-interface/invoicing-list/invoicing-list.component'
import { InvoicingWrapperComponent } from '../../user-interface/invoicing-wrapper/invoicing-wrapper.component'
import { InvoicingRoutingModule } from './invoicing.routing.module'

@NgModule({
    declarations: [
        InvoicingWrapperComponent,
        InvoicingListComponent,
    ],
    imports: [
        MaterialModule,
        SharedModule,
        InvoicingRoutingModule
    ]
})

export class InvoicingModule { }
