import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Ship } from 'src/app/features/ships/base/classes/models/ship'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'reservation-to-vessel-form',
    templateUrl: './reservation-to-vessel-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-vessel-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationToVesselComponent {

    //#region variables

    private feature = 'assignToShip'

    //#endregion

    //#region particular variables

    public ships: Ship[] = []
    public id = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToVesselComponent>, private messageLabelService: MessageLabelService) { }

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
        this.data.ships.subscribe((result: any) => {
            this.ships = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    //#endregion

}