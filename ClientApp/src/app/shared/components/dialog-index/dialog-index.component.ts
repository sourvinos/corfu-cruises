import { MessageLabelService } from './../../services/messages-label.service'
import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { IndexInteractionService } from '../../services/index-interaction.service'

@Component({
    selector: 'dialog-index',
    templateUrl: './dialog-index.component.html',
    styleUrls: ['../../../../assets/styles/dialogs.css']
})

export class DialogIndexComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>();
    public feature = 'index'
    public fields: any[]
    public headers: any[]
    public justify: any[]
    public records: any[]
    public selectedRecord: any
    public title: string
    public visibility: any[]
    public widths: any[]
    public types: any[]
    public highlightFirstRow: boolean

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private indexInteractionService: IndexInteractionService, private messageLabelService: MessageLabelService, public dialogRef: MatDialogRef<DialogIndexComponent>) {
        this.fields = data.fields
        this.headers = data.headers
        this.justify = data.justify
        this.types = data.types
        this.records = data.records
        this.title = data.title
        this.visibility = data.visibility
        this.widths = data.widths
        this.highlightFirstRow = data.highlightFirstRow
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.subscribeToIndexinteractionService()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public onCloseDialog(): void {
        this.dialogRef.close()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

    //#region private methods

    private subscribeToIndexinteractionService(): void {
        this.indexInteractionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.selectedRecord = response
            this.indexInteractionService.dialogMustClose.subscribe(x => {
                if (x) {
                    this.dialogRef.close(this.selectedRecord)
                }
            })
        })
    }

    //#endregion

}
