import { NgModule } from '@angular/core'
// Custom
import { ManifestListComponent } from '../../user-interface/manifest-list/manifest-list.component'
import { ManifestRoutingModule } from './manifest.routing.module'
import { ManifestWrapperComponent } from '../../user-interface/manifest-wrapper/manifest-wrapper.component'
import { MaterialModule } from 'src/app/shared/modules/material.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        ManifestWrapperComponent,
        ManifestListComponent,

    ],
    imports: [
        MaterialModule,
        SharedModule,
        ManifestRoutingModule
    ]
})

export class ManifestModule { }
