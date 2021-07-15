import { NgModule } from '@angular/core'
// Custom
import { EmbarkationListComponent } from '../../user-interface/list/embarkation-list.component'
import { EmbarkationRoutingModule } from './embarkation.routing.module'
import { embarkationCriteriaComponent } from '../../user-interface/criteria/embarkation-criteria.component'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        embarkationCriteriaComponent,
        EmbarkationListComponent
    ],
    imports: [
        SharedModule,
        EmbarkationRoutingModule
    ]
})

export class EmbarkationModule { }
