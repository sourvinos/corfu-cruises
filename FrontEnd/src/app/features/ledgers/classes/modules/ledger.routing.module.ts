import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerListResolver } from '../resolvers/ledger-list.resolver'
import { PrimaryLedgerListComponent } from '../../user-interface/list/primary/primary-ledger-list.component'

const routes: Routes = [
    { path: '', component: LedgerCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'list', component: PrimaryLedgerListComponent, canActivate: [AuthGuardService], resolve: { ledgerList: LedgerListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LedgerRoutingModule { }