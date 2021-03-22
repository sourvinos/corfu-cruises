import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { BoardingListComponent } from '../user-interface/boarding-list.component'
import { BoardingListResolver } from './boarding-list.resolver'

const routes: Routes = [
    {
        path: '', component: BoardingListComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:dateIn/1/2/2', component: BoardingListComponent, canActivate: [AuthGuardService], resolve: { boardingList: BoardingListResolver }, runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BoardingRoutingModule { }