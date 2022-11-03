import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { DriverActiveVM } from './../../../drivers/classes/view-models/driver-active-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'reservation-to-driver-form',
    templateUrl: './reservation-to-driver-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-driver-form.component.css']
})

export class ReservationToDriverComponent {

    //#region variables

    private feature = 'assignToDriver'
    public drivers: DriverActiveVM[] = []
    public selectedDriverId = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToDriverComponent>, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private ngZone: NgZone,) { }

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

    public isDriverSelected(): boolean {
        return this.selectedDriverId == ''
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.selectedDriverId)
        })
    }

    //#endregion

    //#region private methods

    private populateListFromLocalStorage(table: string) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateLists(): void {
        this.populateListFromLocalStorage('drivers')
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
