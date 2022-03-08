import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { Driver } from 'src/app/features/drivers/classes/driver'
import { DriverService } from './../../../drivers/classes/driver.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from './../../../../shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-to-driver-form',
    templateUrl: './reservation-to-driver-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-driver-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationToDriverComponent {

    //#region variables

    private feature = 'assignToDriver'
    public drivers: Driver[] = []
    public selectedDriverId = '';

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToDriverComponent>, private driverService: DriverService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private ngZone: NgZone, private snackbarService: SnackbarService) { }

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
        this.populateList(this.driverService, 'drivers')
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
