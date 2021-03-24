import { BookingDetail } from '../../../../classes/booking-detail'
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

    headers = ['', 'bookingId', 'Id', 'headerLastname', 'headerFirstname', 'headerNationalityId', 'headerNationalityDescription', 'headerGenderId', 'headerGenderDescription', 'headerDoB', 'headerIsCheckedIn', '', '']
    widths = ['0px', '0px', '0px', '0px', '40%', '0px', '0px', '0px', '0px', '0px', '0px', '50px', '50px']
    visibility = ['none', 'none', 'none', '', '', 'none', 'none', 'none', 'none', 'none', 'none', '', '']
    justify = ['center', 'center', 'center', 'left', 'left', 'left', 'left', 'left', 'left', 'center', 'center', 'center', 'center']
    types = ['', '', '', '', '', '', '', '', '', 'date', '', 'trash', '']
    fields = ['', 'bookingId', 'id', 'lastname', 'firstname', 'nationalityId', 'nationalityDescription', 'genderId', 'genderDescription', 'dob', 'isCheckedIn', '', '']

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
                    genderId: 1, genderDescription: '',
                    dob: '',
                    specialCare: '',
                    remarks: '',
                    isCheckedIn: false
                }
            })
            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.bookingDetails.push(result)
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
                    genderId: bookingDetail.genderId,
                    genderDescription: bookingDetail.genderDescription,
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
                    bookingDetail.genderId = result.genderId
                    bookingDetail.genderDescription = result.genderDescription
                    bookingDetail.specialCare = result.specialCare
                    bookingDetail.remarks = result.remarks
                    bookingDetail.isCheckedIn = result.isCheckedIn
                }
            })

        }
    }

    //#endregion

}
