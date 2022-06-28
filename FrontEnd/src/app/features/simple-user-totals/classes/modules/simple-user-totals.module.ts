import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from 'src/app/shared/modules/shared.module'
import { TotalsCriteriaComponent } from '../../user-interface/criteria/simple-user-totals-criteria.component'
import { TotalsListComponent } from '../../user-interface/list/simple-user-totals-list.component'
import { TotalsRoutingModule } from './simple-user-totals.routing.module'

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
