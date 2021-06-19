import { NgModule } from '@angular/core'
// Custom
import { InvoicingListComponent } from '../../user-interface/invoicing-list/invoicing-list.component'
import { InvoicingRoutingModule } from './invoicing.routing.module'
import { InvoicingWrapperComponent } from '../../user-interface/invoicing-wrapper/invoicing-wrapper.component'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        InvoicingWrapperComponent,
        InvoicingListComponent,
    ],
    imports: [
        SharedModule,
        InvoicingRoutingModule
    ]
})

export class InvoicingModule { }
