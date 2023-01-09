import { NgModule } from '@angular/core'
// Custom
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerRoutingModule } from './ledger.routing.module'
import { PrimaryLedgerListComponent } from '../../user-interface/list/primary/primary-ledger-list.component'
import { SecondaryLedgerListComponent } from '../../user-interface/list/secondary/secondary-ledger-list.component'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        LedgerCriteriaComponent,
        PrimaryLedgerListComponent,
        SecondaryLedgerListComponent
    ],
    imports: [
        SharedModule,
        LedgerRoutingModule
    ]
})

export class LedgerModule { }
