import { Component, Input } from '@angular/core'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'summary-block',
    templateUrl: './summary-block.component.html',
    styleUrls: ['./summary-block.component.css']
})

export class SummaryComponent {

    @Input() records: any
    @Input() index: any
    @Input() id: any
    @Input() header: any
    @Input() icon: any

    public upArrow: boolean[] = []
    public downArrow: boolean[] = []
    public scrollTop: number

    private feature = 'reservationList'

    constructor(private messageLabelService: MessageLabelService) { }

    ngAfterViewInit(): void {
        this.showDownArrow(this.index, this.id)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onWindowScroll(index: string | number, event?: { target: { scrollTop: number; clientHeight: any; scrollHeight: number } }): void {
        this.upArrow[index] = event.target.scrollTop > 0 ? true : false
        this.downArrow[index] = event.target.clientHeight + event.target.scrollTop < event.target.scrollHeight ? true : false
    }

    public scrollToTop(element: string): void {
        const el = document.getElementById(element)
        el.scrollTop = Math.max(0, 0)
    }

    public scrollToBottom(element: string): void {
        const el = document.getElementById(element)
        el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight)
    }

    private showDownArrow(index: string | number, element: string): void {
        const div = document.getElementById(element)
        Promise.resolve(null).then(() => {
            this.downArrow[index] = div.clientHeight + div.scrollTop < div.scrollHeight ? true : false
        })
    }

}
