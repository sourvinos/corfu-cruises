import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'

@Component({
    selector: 'reservation-to-ship-form',
    templateUrl: './reservation-to-ship-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-ship-form.component.css']
})

export class ReservationToShipComponent {

    //#region variables

    private feature = 'assignToShip'
    public ships: ShipActiveVM[] = []
    public selectedShipId = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToShipComponent>, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateLists()
    }

    ngAfterViewInit(): void {
        this.unselectAllItems()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isShipSelected(): boolean {
        return this.selectedShipId == ''
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.selectedShipId)
        })
    }

    //#endregion

    //#region private methods

    private populateListFromLocalStorage(table: string) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateLists(): void {
        this.populateListFromLocalStorage('ships')
    }

    private unselectAllItems(): void {
        setTimeout(() => {
            const items = document.querySelectorAll('.p-listbox-item .p-highlight')
            items.forEach(item => {
                item.classList.remove('p-highlight')
            })
        }, 500)
    }

    //#endregion

}
