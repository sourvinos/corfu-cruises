import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerListComponent } from '../../user-interface/list/ledger-list.component'
import { LedgerListResolver } from '../resolvers/ledger-list.resolver'

const routes: Routes = [
    { path: '', component: LedgerCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'list', component: LedgerListComponent, canActivate: [AuthGuardService], resolve: { ledgerList: LedgerListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LedgerRoutingModule { }