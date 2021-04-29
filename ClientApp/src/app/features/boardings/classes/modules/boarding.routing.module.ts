import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { BoardingListComponent } from '../../user-interface/boarding-list/boarding-list.component'
import { BoardingListResolver } from '../resolvers/boarding-list.resolver'
import { boardingListComponent } from '../../user-interface/boarding-wrapper/boarding-wrapper.component'

const routes: Routes = [
    {
        path: '', component: boardingListComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:date/destinationId/:destinationId/portId/:portId/shipId/:shipId', component: BoardingListComponent, canActivate: [AuthGuardService], resolve: { boardingList: BoardingListResolver }, runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BoardingRoutingModule { }