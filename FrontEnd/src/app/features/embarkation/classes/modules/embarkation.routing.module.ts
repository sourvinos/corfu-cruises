import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { EmbarkationCriteriaComponent } from '../../user-interface/criteria/embarkation-criteria.component'
import { EmbarkationListComponent } from '../../user-interface/list/embarkation-list.component'
import { EmbarkationListResolver } from '../resolvers/embarkation-list.resolver'

const routes: Routes = [
    { path: '', component: EmbarkationCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'list', component: EmbarkationListComponent, canActivate: [AuthGuardService], resolve: { embarkationList: EmbarkationListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmbarkationRoutingModule { }