import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { Guid } from 'guid-typescript'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Passenger } from '../../classes/models/passenger'
import { PassengerFormComponent } from '../passenger-form/passenger-form.component'

@Component({
    selector: 'passenger-list',
    templateUrl: './passenger-list.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './passenger-list.component.css']
})

export class PassengerListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    @Input() passengers: Passenger[] = []
    @Input() reservationId: Guid
    @Output() outputPassengerCount = new EventEmitter()
    private ngUnsubscribe = new Subject<void>()
    public feature = 'passengerList'

    //#endregion

    constructor(public dialog: MatDialog, private messageLabelService: MessageLabelService) { }

    //#region lifecycle hooks

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDeleteRow(record: Passenger): void {
        const index = this.passengers.indexOf(record)
        this.passengers.splice(index, 1)
        this.outputPassengerCount.emit(this.passengers.length)
    }

    public onEditRecord(record: Passenger): void {
        this.showPassengerForm(record)
    }

    public onNew(): void {
        this.showPassengerForm()
    }

    //#endregion

    //#region private methods

    private populateForm(passenger: Passenger): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            data: {
                id: passenger.id,
                reservationId: passenger.reservationId,
                lastname: passenger.lastname,
                firstname: passenger.firstname,
                nationality: passenger.nationality,
                birthdate: passenger.birthdate,
                gender: passenger.gender,
                remarks: passenger.remarks,
                specialCare: passenger.specialCare,
                isCheckedIn: passenger.isCheckedIn
            }
        })
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                passenger = this.passengers.find(({ id }) => id === result.id)
                passenger.lastname = result.lastname
                passenger.firstname = result.firstname
                passenger.nationality = result.nationality
                passenger.birthdate = result.birthdate
                passenger.gender = result.gender
                passenger.specialCare = result.specialCare
                passenger.remarks = result.remarks
                passenger.isCheckedIn = result.isCheckedIn
            }
        })

    }

    private showEmptyForm(): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            data: {
                id: 0,
                reservationId: this.reservationId,
                lastname: '',
                firstname: '',
                nationality: { 'id': 1, 'description': '' },
                gender: { 'id': 1, 'description': '' },
                birthdate: '',
                specialCare: '',
                remarks: '',
                isCheckedIn: false
            }
        })
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.passengers.push(result)
                this.passengers = [...this.passengers]
                this.outputPassengerCount.emit(this.passengers.length)
            }
        })
    }

    private showPassengerForm(passenger?: any): void {
        if (passenger == undefined) {
            this.showEmptyForm()
        }
        if (passenger != undefined) {
            this.populateForm(passenger)
        }
    }

    //#endregion

}
