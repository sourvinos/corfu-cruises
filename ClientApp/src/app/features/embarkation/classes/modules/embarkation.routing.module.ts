import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { EmbarkationListComponent } from '../../user-interface/embarkation-list/embarkation-list.component'
import { EmbarkationWrapperComponent } from '../../user-interface/embarkation-wrapper/embarkation-wrapper.component'
import { EmbarkationListResolver } from '../resolvers/embarkation-list.resolver'

const routes: Routes = [
    { path: '', component: EmbarkationWrapperComponent, canActivate: [AuthGuardService] },
    { path: 'date/:date/destinationId/:destinationId/portId/:portId/shipId/:shipId', component: EmbarkationListComponent, canActivate: [AuthGuardService], resolve: { embarkationList: EmbarkationListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmbarkationRoutingModule { }