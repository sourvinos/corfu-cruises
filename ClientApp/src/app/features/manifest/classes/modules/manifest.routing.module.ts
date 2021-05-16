import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { ManifestListResolver } from '../resolvers/manifest-list.resolver'
import { ManifestWrapperComponent } from '../../user-interface/manifest-wrapper/manifest-wrapper.component'
import { ManifestListComponent } from '../../user-interface/manifest-list/manifest-list.component'

const routes: Routes = [
    {
        path: '', component: ManifestWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'date/:date/shipId/:shipId/portId/:portId', component: ManifestListComponent, canActivate: [AuthGuardService], resolve: { manifestList: ManifestListResolver }, runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ManifestRoutingModule { }