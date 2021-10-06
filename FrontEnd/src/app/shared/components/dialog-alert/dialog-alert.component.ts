import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MessageLabelService } from '../../services/messages-label.service'

@Component({
    selector: 'dialog-alert',
    templateUrl: './dialog-alert.component.html',
    styleUrls: ['../../../../assets/styles/dialogs.css']
})

export class DialogAlertComponent {

    //#region variables

    private feature = 'dialog'
    public titleColor = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogAlertComponent>, private messageLabelService: MessageLabelService) {
        switch (data.titleColor) {
            case 'warningColor':
                this.titleColor = '#fe9f36'
                break
            case 'errorColor':
                this.titleColor = '#ff4000'
                break
            default:
                break
        }
    }

    //#region public methods

    public onClose(): void {
        this.dialogRef.close()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

}
