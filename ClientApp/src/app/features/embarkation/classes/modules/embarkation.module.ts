import { NgModule } from '@angular/core'
// Custom
import { EmbarkationListComponent } from '../../user-interface/embarkation-list/embarkation-list.component'
import { EmbarkationRoutingModule } from './embarkation.routing.module'
import { EmbarkationWrapperComponent } from '../../user-interface/embarkation-wrapper/embarkation-wrapper.component'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        EmbarkationWrapperComponent,
        EmbarkationListComponent,

    ],
    imports: [
        SharedModule,
        EmbarkationRoutingModule
    ]
})

export class EmbarkationModule { }
