import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { InvoicingListComponent } from '../../user-interface/invoicing-list/invoicing-list.component'
import { InvoicingListResolver } from '../resolvers/invoicing-list.resolver'
import { InvoicingWrapperComponent } from '../../user-interface/invoicing-wrapper/invoicing-wrapper.component'

const routes: Routes = [
    {
        path: '', component: InvoicingWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:dateIn', component: InvoicingListComponent, canActivate: [AuthGuardService], resolve: { invoicingList: InvoicingListResolver }, children: [
                ], runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InvoicingRoutingModule { }