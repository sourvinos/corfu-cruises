import { NgModule } from '@angular/core'
// Custom
import { EmbarkationCriteriaComponent } from '../../user-interface/criteria/embarkation-criteria.component'
import { EmbarkationListComponent } from '../../user-interface/list/embarkation-list.component'
import { EmbarkationRoutingModule } from './embarkation.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        EmbarkationCriteriaComponent,
        EmbarkationListComponent
    ],
    imports: [
        SharedModule,
        EmbarkationRoutingModule
    ]
})

export class EmbarkationModule { }
