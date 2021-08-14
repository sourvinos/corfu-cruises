import { Component, Input, ViewChild } from '@angular/core'
import { Guid } from 'guid-typescript'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
// Custom
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Passenger } from '../../classes/models/passenger'
import { PassengerFormComponent } from '../passenger-form/passenger-form.component'
import { Table } from 'primeng/table'

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
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    public feature = 'passengerList'
    public highlightFirstRow = false

    //#endregion

    constructor(public dialog: MatDialog, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        // this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }
    //#endregion

    //#region public methods

    public onEditRecord(record: Passenger): void {
        this.showPassengerForm(record)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onNew(): void {
        this.showPassengerForm()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    console.log('...')
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    // private subscribeToInteractionService(): void {
    //     this.interactionService.reservation.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
    //         this.editRecord(response)
    //     })
    // }

    private populateForm(passenger: Passenger): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            data: {
                id: passenger.id,
                reservationId: passenger.reservationId,
                lastname: passenger.lastname,
                firstname: passenger.firstname,
                nationality: passenger.nationality,
                occupant: passenger.occupant,
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
                birthdate: '',
                specialCare: '',
                remarks: '',
                isCheckedIn: false
            }
        })
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                console.log('New passenger', result)
                this.passengers.push(result)
            }
        })
    }

    private showPassengerForm(passenger?: any): void {
        if (passenger == undefined) {
            this.showEmptyForm()
            // const dialog = this.dialog.open(PassengerFormComponent, {
            //     data: {
            //         id: 0,
            //         reservationId: this.reservationId,
            //         lastname: '',
            //         firstname: '',
            //         occupantId: 2,
            //         nationalityId: 1, nationalityDescription: '',
            //         genderId: 1, genderDescription: '',
            //         birthdate: '',
            //         specialCare: '',
            //         remarks: '',
            //         isCheckedIn: false
            //     }
            // })
            // dialog.afterClosed().subscribe((result: any) => {
            //     if (result) {
            //         this.passengers.push(result)
            //     }
            // })
        }
        if (passenger != undefined) {
            this.populateForm(passenger)
        }
    }

    //#endregion

}
