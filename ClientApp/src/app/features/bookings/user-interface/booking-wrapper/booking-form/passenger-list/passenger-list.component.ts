import { BookingDetail } from './../../../../classes/booking-detail'
import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { PassengerFormComponent } from './passenger-form/passenger-form.component'

@Component({
    selector: 'passenger-list',
    templateUrl: './passenger-list.component.html',
    styleUrls: ['../../../../../../../assets/styles/forms.css', './passenger-list.component.css']
})

export class PassengerListComponent {

    //#region variables

    public feature = 'passengerList'
    public highlightFirstRow = false
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten

    //#endregion

    //#region table

    headers = ['', 'bookingId', 'Id', 'headerLastname', 'headerFirstname', 'headerNationalityId', 'headerNationality', 'headerDoB', 'headerIsCheckedIn', '', '']
    widths = ['40px', '60px', '60px', '10%', '10%', '50px', '100px', '20%', '10%', '56px', '56px']
    visibility = ['', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'left', 'center', 'left', 'left', 'center', 'left', 'center', 'center']
    types = ['', '', '', '', '', '', '', 'date', '', 'trash', '']
    fields = ['', 'bookingId', 'id', 'lastname', 'firstname', 'nationalityId', 'nationalityDescription', 'dob', 'isCheckedIn', '', '']

    //#endregion

    @Input() bookingDetails: BookingDetail[]
    @Input() bookingId: number

    constructor(public dialog: MatDialog, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeToInteractionService()
    }


    ngOnDestroy(): void {
        console.log('Unsubscribing passenger list')
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }
    //#endregion

    //#region public methods

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

    private editRecord(bookingDetail: any): void {
        this.showPassengerForm(bookingDetail)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.booking.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            console.log('From service in passenger list', response)
            this.editRecord(response)
        })
    }

    private showPassengerForm(bookingDetail?: any): void {
        if (bookingDetail == undefined) {
            const dialog = this.dialog.open(PassengerFormComponent, {
                data: {
                    id: 0,
                    bookingId: this.bookingId,
                    lastname: '',
                    firstname: '',
                    occupantId: 2,
                    nationalityId: 1, nationalityDescription: '',
                    dob: '',
                    email: '',
                    phones: '',
                    specialCare: '',
                    remarks: '',
                    isCheckedIn: false
                }
            })
            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    // console.log('New passenger', result)
                    // console.log('Current passengers', this.bookingDetails)
                    this.bookingDetails.push(result)
                    // console.log('Updated passengers', this.bookingDetails)
                    // this.interactionService.sendPassengerToPassengerList(this.bookingDetails)
                }
            })
        }
        if (bookingDetail != undefined) {
            const dialog = this.dialog.open(PassengerFormComponent, {
                data: {
                    id: bookingDetail.id,
                    bookingId: bookingDetail.bookingId,
                    lastname: bookingDetail.lastname,
                    firstname: bookingDetail.firstname,
                    nationalityId: bookingDetail.nationalityId,
                    nationalityDescription: bookingDetail.nationalityDescription,
                    occupantId: bookingDetail.occupantId,
                    dob: bookingDetail.dob,
                    email: bookingDetail.email,
                    phones: bookingDetail.phones,
                    remarks: bookingDetail.remarks,
                    specialCare: bookingDetail.specialCare,
                    isCheckedIn: bookingDetail.isCheckedIn
                }
            })
            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    bookingDetail = this.bookingDetails.find(({ id }) => id === result.id)
                    bookingDetail.lastname = result.lastname
                    bookingDetail.firstname = result.firstname
                    bookingDetail.nationalityId = result.nationalityId
                    bookingDetail.nationalityDescription = result.nationalityDescription
                    bookingDetail.dob = result.dob
                    bookingDetail.email = result.email
                    bookingDetail.phones = result.phones
                    bookingDetail.specialCare = result.specialCare
                    bookingDetail.remarks = result.remarks
                    bookingDetail.isCheckedIn = result.isCheckedIn
                    console.log(bookingDetail)
                }
            })

        }
    }

    //#endregion

}
