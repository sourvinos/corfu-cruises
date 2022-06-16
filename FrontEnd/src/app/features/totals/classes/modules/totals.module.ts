import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from 'src/app/shared/modules/shared.module'
import { TotalsCriteriaComponent } from '../../user-interface/criteria/totals-criteria.component'
import { TotalsListComponent } from '../../user-interface/list/totals-list.component'
import { TotalsRoutingModule } from './totals.routing.module'

@NgModule({
    declarations: [
        TotalsCriteriaComponent,
        TotalsListComponent
    ],
    imports: [
        SharedModule,
        TotalsRoutingModule
    ]
})

export class TotalsModule { }
