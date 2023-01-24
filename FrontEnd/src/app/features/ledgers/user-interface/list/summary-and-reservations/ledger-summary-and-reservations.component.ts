import { Component, Inject } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { LedgerVM } from '../../../classes/view-models/list/ledger-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'ledger-customer-summary-and-reservations',
    templateUrl: './ledger-summary-and-reservations.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css']
})

export class LedgerCustomerSummaryAndReservationsComponent {

    //#region variables

    private feature = 'ledgerList'
    public customerReservations: LedgerVM

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<LedgerCustomerSummaryAndReservationsComponent>, private messageLabelService: MessageLabelService, public dialog: MatDialog) { }

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    //#endregion


}
