import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipDropdownVM } from '../../../ships/classes/view-models/ship-dropdown-vm'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-to-ship-form',
    templateUrl: './reservation-to-ship-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-ship-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationToShipComponent {

    //#region variables

    private feature = 'assignToShip'
    public ships: ShipDropdownVM[] = []
    public selectedShipId = '';

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToShipComponent>, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private ngZone: NgZone, private shipService: ShipService, private snackbarService: SnackbarService) { }

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

    private populateList(service: any, table: any): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateLists(): void {
        this.populateList(this.shipService, 'ships')
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
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
