import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { InvoicingCriteriaComponent } from '../../user-interface/criteria/invoicing-criteria.component'
import { InvoicingListComponent } from '../../user-interface/list/invoicing-list.component'
import { InvoicingListResolver } from '../resolvers/invoicing-list.resolver'

const routes: Routes = [
    { path: '', component: InvoicingCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'date/:date/customer/:customerId/destination/:destinationId/vessel/:vesselId', component: InvoicingListComponent, canActivate: [AuthGuardService], resolve: { invoicingList: InvoicingListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InvoicingRoutingModule { }