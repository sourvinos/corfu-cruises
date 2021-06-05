import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Guid } from 'guid-typescript'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { WebPassenger } from '../../classes/models/web-passenger'
import { WebPassengerFormComponent } from '../passenger-form/web-passenger-form.component'

@Component({
    selector: 'web-passenger-list',
    templateUrl: './web-passenger-list.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './web-passenger-list.component.css']
})

export class WebPassengerListComponent {

    //#region variables

    @Input() passengers: WebPassenger[] = []
    @Input() reservationId: Guid
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    public feature = 'passengerList'
    public highlightFirstRow = false

    //#endregion

    //#region table

    headers = ['', 'reservationId', 'Id', 'headerLastname', 'headerFirstname', 'headerNationalityId', 'headerNationalityDescription', 'headerGenderId', 'headerGenderDescription', 'headerDoB', 'headerIsCheckedIn', '', '']
    widths = ['0px', '60px', '60px', '0px', '40%', '0px', '0px', '0px', '0px', '0px', '0px', '50px', '50px']
    visibility = ['none', 'none', 'none', '', '', 'none', 'none', 'none', 'none', 'none', 'none', '', '']
    justify = ['center', 'center', 'center', 'left', 'left', 'left', 'left', 'left', 'left', 'center', 'center', 'center', 'center']
    types = ['', '', '', '', '', '', '', '', '', 'date', '', 'trash', '']
    fields = ['', 'reservationId', 'id', 'lastname', 'firstname', 'nationalityId', 'nationalityDescription', 'genderId', 'genderDescription', 'birthDate', 'isCheckedIn', '', '']

    //#endregion

    constructor(public dialog: MatDialog, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService) { }

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

    private editRecord(reservationDetail: any): void {
        this.showPassengerForm(reservationDetail)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.reservation.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response)
        })
    }

    private showPassengerForm(reservationDetail?: any): void {
        if (reservationDetail == undefined) {
            const dialog = this.dialog.open(WebPassengerFormComponent, {
                data: {
                    id: 0,
                    reservationId: this.reservationId,
                    lastname: '',
                    firstname: '',
                    occupantId: 2,
                    nationalityId: 1, nationalityDescription: '',
                    genderId: 1, genderDescription: '',
                    birthDate: '',
                    specialCare: '',
                    remarks: '',
                    isCheckedIn: false
                }
            })
            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.passengers.push(result)
                }
            })
        }
        if (reservationDetail != undefined) {
            const dialog = this.dialog.open(WebPassengerFormComponent, {
                data: {
                    id: reservationDetail.id,
                    reservationId: reservationDetail.reservationId,
                    lastname: reservationDetail.lastname,
                    firstname: reservationDetail.firstname,
                    nationalityId: reservationDetail.nationalityId,
                    nationalityDescription: reservationDetail.nationalityDescription,
                    occupantId: reservationDetail.occupantId,
                    birthDate: reservationDetail.birthDate,
                    genderId: reservationDetail.genderId,
                    genderDescription: reservationDetail.genderDescription,
                    remarks: reservationDetail.remarks,
                    specialCare: reservationDetail.specialCare,
                    isCheckedIn: reservationDetail.isCheckedIn
                }
            })
            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    reservationDetail = this.passengers.find(({ id }) => id === result.id)
                    reservationDetail.lastname = result.lastname
                    reservationDetail.firstname = result.firstname
                    reservationDetail.nationalityId = result.nationalityId
                    reservationDetail.nationalityDescription = result.nationalityDescription
                    reservationDetail.birthDate = result.birthDate
                    reservationDetail.genderId = result.genderId
                    reservationDetail.genderDescription = result.genderDescription
                    reservationDetail.specialCare = result.specialCare
                    reservationDetail.remarks = result.remarks
                    reservationDetail.isCheckedIn = result.isCheckedIn
                }
            })

        }
    }

    //#endregion

}
