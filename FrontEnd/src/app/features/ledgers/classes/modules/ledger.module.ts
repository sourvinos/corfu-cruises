import { NgModule } from '@angular/core'
// Custom
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerListComponent } from '../../user-interface/list/ledger-list.component'
import { LedgerRoutingModule } from './ledger.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        LedgerCriteriaComponent,
        LedgerListComponent
    ],
    imports: [
        SharedModule,
        LedgerRoutingModule
    ]
})

export class LedgerModule { }
