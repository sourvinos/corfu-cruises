import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { EmbarkationListComponent } from '../../user-interface/list/embarkation-list.component'
import { embarkationCriteriaComponent } from '../../user-interface/criteria/embarkation-criteria.component'
import { EmbarkationListResolver } from '../resolvers/embarkation-list.resolver'

const routes: Routes = [
    { path: '', component: embarkationCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'date/:date/destinationId/:destinationId/portId/:portId/shipId/:shipId', component: EmbarkationListComponent, canActivate: [AuthGuardService], resolve: { embarkationList: EmbarkationListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmbarkationRoutingModule { }