import { Component } from "@angular/core"
import { MatDialogRef } from "@angular/material/dialog"
// Custom
import { MessageLabelService } from "src/app/shared/services/messages-label.service"

@Component({
    selector: 'calendar-legend',
    templateUrl: './calendar-legend.component.html',
    styleUrls: ['./calendar-legend.component.css']
})

export class CalendarLegendComponent {

    private feature = 'calendarLegend'

    constructor(private messageLabelService: MessageLabelService, public dialogRef: MatDialogRef<CalendarLegendComponent>) { }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onClose(): void {
        this.dialogRef.close()
    }

}
