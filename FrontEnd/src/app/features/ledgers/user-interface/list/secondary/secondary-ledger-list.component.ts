import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
// Custom
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { LedgerVM } from '../../../classes/view-models/ledger-vm'

@Component({
    selector: 'secondary-ledger-list',
    templateUrl: './secondary-ledger-list.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './secondary-ledger-list.component.css']
})

export class SecondaryLedgerListComponent {

    //#region variables

    private feature = 'ledgerList'
    public customerReservations: LedgerVM

    //#endregion

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<SecondaryLedgerListComponent>,
        private localStorageService: LocalStorageService,
        private dialogService: DialogService,
        private emojiService: EmojiService,
        private messageLabelService: MessageLabelService,
        private ngZone: NgZone,
        private dateHelperService: DateHelperService,
    ) {
        console.log('Customer', data)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onShowRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', ['ok'])
    }

    public onClose(): void {
        this.dialogRef.close()
    }

}
