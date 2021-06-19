import { NgModule } from '@angular/core'
// Custom
import { ManifestListComponent } from '../../user-interface/manifest-list/manifest-list.component'
import { ManifestRoutingModule } from './manifest.routing.module'
import { ManifestWrapperComponent } from '../../user-interface/manifest-wrapper/manifest-wrapper.component'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        ManifestWrapperComponent,
        ManifestListComponent,

    ],
    imports: [
        SharedModule,
        ManifestRoutingModule
    ]
})

export class ManifestModule { }
