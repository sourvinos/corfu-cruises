import { Component, Inject, Input } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { LedgerVM } from '../../../classes/view-models/ledger-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { LedgerPortVM } from '../../../classes/view-models/ledger-port-group-vm'

@Component({
    selector: 'ledger-customer-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './summary.component.css']
})

export class LedgerCustomerSummaryComponent {

    //#region variables

    @Input() ports: LedgerPortVM
    private feature = 'ledgerList'
    public customerReservations: LedgerVM

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<LedgerCustomerSummaryComponent>, private emojiService: EmojiService, private messageLabelService: MessageLabelService) {
        // setTimeout(() => {
        //     document.getElementById('boo').click()
        // }, 500)
    }

    //#region public methods

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    //#endregion

}
