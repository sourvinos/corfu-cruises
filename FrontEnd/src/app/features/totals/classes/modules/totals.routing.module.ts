import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { TotalsCriteriaComponent } from '../../user-interface/criteria/totals-criteria.component'
import { TotalsListComponent } from '../../user-interface/list/totals-list.component'
import { TotalsListResolver } from '../resolvers/totals-list.resolver'

const routes: Routes = [
    { path: '', component: TotalsCriteriaComponent, canActivate: [AuthGuardService] },
    {
        path: 'fromDate/:fromDate/toDate/:toDate',
        component: TotalsListComponent,
        canActivate: [AuthGuardService],
        resolve: {
            totalsList: TotalsListResolver
        },
        runGuardsAndResolvers: 'always'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TotalsRoutingModule { }