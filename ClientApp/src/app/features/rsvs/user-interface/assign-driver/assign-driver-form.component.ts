import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Driver } from 'src/app/features/drivers/classes/driver'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'booking-assign-driver',
    templateUrl: './assign-driver-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './assign-driver-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BookingAssignToDriverComponent {

    //#region variables

    private feature = 'assignToDriver'

    //#endregion

    //#region particular variables

    public drivers: Driver[] = []
    public id = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<BookingAssignToDriverComponent>, private messageLabelService: MessageLabelService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateDropDowns()
    }

    //#endregion

    //#region public methods

    public onClose(): void {
        this.dialogRef.close()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

    //#region private methods

    private populateDropDowns(): void {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    //#endregion

}
