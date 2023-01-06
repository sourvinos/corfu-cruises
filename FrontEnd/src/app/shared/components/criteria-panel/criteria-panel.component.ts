import { Component, Input } from '@angular/core'
// Custom
import { MessageLabelService } from '../../services/messages-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'criteria-panel',
    templateUrl: './criteria-panel.component.html',
    styleUrls: ['./criteria-panel.component.css']
})

export class CriteriaPanelComponent {

    @Input() backgroundColor: string
    @Input() feature: string
    @Input() header: string
    @Input() icon: string
    @Input() records: any[]

    constructor(private messageLabelService: MessageLabelService) { }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

}
