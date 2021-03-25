import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { BoardingListComponent } from '../user-interface/boarding-list/boarding-list.component'
import { boardingListComponent } from '../user-interface/boarding-wrapper.component'
import { BoardingListResolver } from './boarding-list.resolver'

const routes: Routes = [
    {
        path: '', component: boardingListComponent, canActivate: [AuthGuardService], children: [
            {
                path: ':dateIn/:destinationId/:portId/:shipId', component: BoardingListComponent, canActivate: [AuthGuardService], resolve: { boardingList: BoardingListResolver }, runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BoardingRoutingModule { }