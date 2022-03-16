import { Component, Input } from '@angular/core'
// Custom
import { MessageLabelService } from '../../services/messages-label.service'
import { slideFromLeft } from '../../animations/animations'

@Component({
    selector: 'home-button-and-title',
    templateUrl: './home-button-and-title.component.html',
    styleUrls: ['./home-button-and-title.component.css'],
    animations: [slideFromLeft]
})

export class HomeButtonAndTitleComponent {

    @Input() feature: string
    @Input() parentUrl: any
    @Input() icon: string
    @Input() header: string

    constructor(private messageLabelService: MessageLabelService) { }

    public getIcon(): string {
        return this.icon
    }

    public getLabel(): string {
        return this.messageLabelService.getDescription(this.feature, this.header ? this.header : 'header')
    }

}
