import { NgModule } from '@angular/core'
// Custom
import { InvoicingCriteriaComponent } from '../../user-interface/criteria/invoicing-criteria.component'
import { InvoicingListComponent } from '../../user-interface/list/invoicing-list.component'
import { InvoicingRoutingModule } from './invoicing.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        InvoicingCriteriaComponent,
        InvoicingListComponent
    ],
    imports: [
        SharedModule,
        InvoicingRoutingModule
    ]
})

export class InvoicingModule { }
