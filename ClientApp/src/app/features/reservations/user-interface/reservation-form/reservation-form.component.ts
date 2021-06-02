import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerService } from 'src/app/features/customers/classes/customer.service'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { Passenger } from '../../classes/models/passenger'
import { PickupPointFlat } from '../../../pickupPoints/classes/pickupPoint-flat'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { Reservation } from '../../classes/models/reservation'
import { ReservationService } from '../../classes/services/reservation.service'
import { ReservationWriteResource } from './../../classes/resources/reservation-write-resource'
import { ScheduleService } from 'src/app/features/schedules/classes/schedule.service'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserService } from 'src/app/features/users/classes/user.service'
import { ValidationService } from './../../../../shared/services/validation.service'
import { VoucherService } from '../../classes/services/voucher.service'
import { environment } from 'src/environments/environment'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-form',
    templateUrl: './reservation-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './reservation-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationFormComponent {

    //#region variables

    private feature = 'reservationForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '../../'
    private windowTitle = 'Reservation'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    private drivers: any
    private pickupPoints: any
    private ports: any
    private ships: any
    public customers: any
    public destinations: any
    public pickupPointsFlat: PickupPointFlat[]
    public barcode = "0"
    public errorCorrectionLevel: "M"
    public margin = 4
    public width = 128
    private savedTotalPersons = 0

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private portService: PortService, private reservationService: ReservationService, private router: Router, private scheduleService: ScheduleService, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService, private voucherService: VoucherService, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
            } else {
                setTimeout(() => { this.populateFormWithDefaultValues() }, 1000)
                this.showModalForm().then(() => {
                    this.focus('destinationDescription')
                })
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.getCustomer()
    }

    ngDoCheck(): void {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.form.patchValue({ passengers: response })
        })
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.mustStayOnTheList(true)
                    this.onGoBack()
                    return true
                }
            })
        } else {
            this.hideModalForm()
            return true
        }
    }

    //#endregion

    //#region public methods

    public onCalculateTotalPersons(): boolean {
        const totalPersons = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPersons: Number(totalPersons) ? totalPersons : 0 })
        return totalPersons > 0 ? true : false
    }

    public onEmailVoucher(): void {
        this.voucherService.createVoucherOnServer(this.form.value).subscribe(() => {
            this.voucherService.emailVoucher(this.form.value.email)
            this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
        }, () => {
            this.showSnackbar(this.messageSnackbarService.invalidModel(), 'error')
        })
    }

    public onMustBeAdmin(): boolean {
        return this.isAdmin()
    }

    public correctPassengerCount(): boolean {
        return this.mapPassengers().length == this.form.value.totalPersons && this.form.value.totalPersons > 0
    }

    public onDoBarcodeJobs(): void {
        this.createBarcodeFromTicket().then(() => {
            this.convertBarcodeToString().then((result) => {
                this.form.patchValue({ uri: result })
            })
        })
    }

    public onDoVoucherTasksClient(): void {
        this.voucherService.createVoucherOnClient(this.mapObjectToVoucher())
    }

    public onDoVoucherTasksServer(): void {
        this.voucherService.createVoucherOnServer(this.form.value).subscribe(() => {
            this.voucherService.emailVoucher(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.reservationService.delete(this.form.value.reservationId).subscribe(() => {
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.mustStayOnTheList(true)
                    this.onGoBack()
                    this.interactionService.removeTableRow(this.getRowIndex(this.form.value.reservationId))
                    this.resetForm()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate([this.url], { relativeTo: this.activatedRoute })
    }

    public onLookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[], value: { target: any }): void {
        let filteredArray = []
        lookupArray.filter(x => {
            filteredArray = this.helperService.pushItemToFilteredArray(x, fields[1], value, filteredArray)
        })
        if (filteredArray.length === 0) {
            this.clearFields(null, formFields[0], formFields[1])
        }
        if (filteredArray.length === 1) {
            const [...elements] = filteredArray
            this.patchFields(elements[0], fields)
        }
        if (filteredArray.length > 1) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify, types)
        }
    }

    public onValidateReservation(): void {
        let maxPersons = 0
        let primaryPortMaxPersons = 0
        let secondaryPortMaxPersons = 0
        let reservationsPrimaryPort = 0
        let reservationsSecondaryPort = 0
        let overSecondaryPort = 0
        this.scheduleService.getForDateAndDestination(this.form.value.date, this.form.value.destinationId).then(a => {
            maxPersons = a.maxPersons
            console.log('Max Persons', maxPersons)
            if (maxPersons == 0) {
                this.showScheduleNotFound()
            } else {
                this.scheduleService.getForDateAndDestinationAndPort(this.form.value.date, this.form.value.destinationId, 2).then(b => {
                    primaryPortMaxPersons = b.maxPersons
                    console.log('Primary port max persons', primaryPortMaxPersons)
                    this.scheduleService.getForDateAndDestinationAndPort(this.form.value.date, this.form.value.destinationId, 3).then(c => {
                        secondaryPortMaxPersons = c.maxPersons
                        console.log('Secondary port max persons', secondaryPortMaxPersons)
                        this.reservationService.getByDateDestinationPort(this.form.value.date, this.form.value.destinationId, 2).then(e => {
                            reservationsPrimaryPort = e.totalPersons
                            console.log('Primary port reservations', reservationsPrimaryPort)
                            this.reservationService.getByDateDestinationPort(this.form.value.date, this.form.value.destinationId, 3).then(d => {
                                reservationsSecondaryPort = d.totalPersons
                                console.log('Secondary port reservations', reservationsSecondaryPort)
                                if (reservationsSecondaryPort > secondaryPortMaxPersons) {
                                    overSecondaryPort = reservationsSecondaryPort - secondaryPortMaxPersons
                                    reservationsPrimaryPort += overSecondaryPort
                                    console.log('Secondary has overbooking, transfering to primary', reservationsSecondaryPort - secondaryPortMaxPersons)
                                    console.log('Primary port reservations', reservationsPrimaryPort)
                                    if (reservationsPrimaryPort + reservationsSecondaryPort - overSecondaryPort + this.form.value.totalPersons > maxPersons) {
                                        this.showSnackbar(this.messageSnackbarService.isOverbooking(), 'error')
                                        console.log('STOP! OVERBOOKING')
                                    } else {
                                        console.log('OK. Continue')
                                        this.save()
                                    }
                                } else {
                                    if (this.form.value.portId == 2) {
                                        if (reservationsPrimaryPort + this.form.value.totalPersons > primaryPortMaxPersons) {
                                            this.showSnackbar(this.messageSnackbarService.isOverbooking(), 'error')
                                            console.log('STOP! OVERBOOKING PRIMARY')
                                        } else {
                                            console.log('OK. Continue on primary')
                                            this.save()
                                        }
                                    } else {
                                        if (reservationsPrimaryPort + reservationsSecondaryPort + this.form.value.totalPersons > maxPersons) {
                                            this.showSnackbar(this.messageSnackbarService.isOverbooking(), 'error')
                                            console.log('STOP! OVERBOOKING')
                                        } else {
                                            console.log('OK. Continue')
                                            this.save()
                                        }
                                    }
                                }
                            })
                        })
                    })
                })
            }
        })
    }

    // private sendVoucher(): void {
    //     this.reservationService.emailVoucher(this.mapObjectToVoucher()).subscribe(() => {
    //         this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
    //     }, () => {
    //         this.showSnackbar(this.messageSnackbarService.invalidModel(), 'error')
    //     })
    // }

    // public onPrintVoucher(): void {
    //     this.reservationService.printVoucher(this.mapObjectToVoucher()).subscribe(() => {
    //         this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
    //     }, () => {
    //         this.showSnackbar(this.messageSnackbarService.invalidModel(), 'error')
    //     })
    // }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.mustStayOnTheList(true)
                    this.onGoBack()
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    if (this.onCalculateTotalPersons())
                        this.buttonClickService.clickOnButton(event, 'save')
                }
            },
            'Alt.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'abort')
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'ok')
                }
            },
            'Ctrl.Right': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'mat-tab-label-0-1')
            }
        }, {
            priority: 3,
            inputs: true
        })
    }

    private clearFields(result: any, id: any, description: any): void {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    private convertBarcodeToString(): Promise<any> {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                const myCanvas = <HTMLCanvasElement>document.getElementsByTagName('canvas')[0]
                const dataURI = myCanvas.toDataURL("image/png")
                resolve(dataURI)
            }, 1000)
        })
        return promise
    }

    private createBarcodeFromTicket(): Promise<any> {
        return new Promise((resolve) => {
            this.barcode = this.form.value.ticketNo == '' ? '9999' : this.form.value.ticketNo
            resolve(this.barcode)
        })
    }

    private flattenDetails(passengers: Passenger[]): any {
        const passengersFlat = []
        passengers.forEach(passenger => {
            const passengerFlat = {
                "id": passenger.id,
                "reservationId": passenger.reservationId,
                "occupantId": passenger.occupant.id,
                "nationalityId": passenger.nationality.id,
                "nationalityDescription": passenger.nationality.description,
                "lastname": passenger.lastname,
                "firstname": passenger.firstname,
                "dob": passenger.dob.substr(0, 10),
                "genderId": passenger.gender.id,
                "genderDescription": passenger.gender.description,
                "specialCare": passenger.specialCare,
                "remarks": passenger.remarks,
                "isCheckedIn": passenger.isCheckedIn
            }
            passengersFlat.push(passengerFlat)
        })
        return passengersFlat
    }

    private flattenPickupPoints(): any[] {
        this.pickupPointsFlat = []
        for (const {
            id: a,
            description: b,
            exactPoint: c,
            time: d,
            route: { port: { id: e } }
        } of this.pickupPoints) {
            this.pickupPointsFlat.push({ pickupPointId: a, pickupPointDescription: b, exactPoint: c, time: d, portId: e })
        }
        return this.pickupPointsFlat
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private formatDate(date: any): string {
        const value = moment(date)
        return value.format('YYYY-MM-DD')
    }

    private getCustomer(): void {
        const userId = this.helperService.readItem('userId')
        this.userService.getSingle(userId).subscribe(user => {
            if (user.isAdmin == false) {
                this.customerService.getSingle(user.customerId).subscribe(customer => {
                    this.form.patchValue({ customerId: customer.id })
                    this.form.patchValue({ customerDescription: customer.description })
                })
            }
        })
    }

    private getRecord(id: number): void {
        this.reservationService.getSingle(id).subscribe(result => {
            this.showModalForm().then(() => {
                this.updateTotalPersons(result)
                this.populateFields(result)
                this.focus('destinationDescription')
                this.onDoBarcodeJobs()
            })
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            this.mustStayOnTheList(false)
            this.onGoBack()
        })
    }

    private getRowIndex(recordId: string): number {
        const table = <HTMLTableElement>document.querySelector('table')
        for (let i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[1].innerText == recordId) {
                return i - 1
            }
        }
    }

    private hideModalForm(): void {
        document.getElementById('reservationFormModal').style.visibility = "hidden"
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: '',
            destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
            customerId: [0, Validators.required], customerDescription: [{ value: '', disabled: !this.isAdmin() }, Validators.required],
            pickupPointId: [0, Validators.required], pickupPointDescription: ['', Validators.required], pickupPointExactPoint: '', pickupPointTime: '',
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPersons: ['0', ValidationService.isGreaterThanZero],
            driverId: [1, Validators.required], driverDescription: [{ value: '', disabled: true }, Validators.required],
            portId: [1, Validators.required], portDescription: [{ value: '', disabled: true }, Validators.required],
            shipId: [1, Validators.required], shipDescription: [{ value: '', disabled: true }, Validators.required],
            ticketNo: ['', [Validators.required, Validators.maxLength(128)]],
            email: ['', [Validators.maxLength(128), Validators.email]],
            phones: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            userId: this.helperService.readItem('userId'),
            uri: '',
            passengers: []
        })
    }

    private isAdmin(): boolean {
        let isAdmin = false
        this.accountService.currentUserRole.subscribe(result => {
            isAdmin = result.toLowerCase() == 'admin'
        })
        return isAdmin
    }

    private isGuid(reservationId: string): any {
        return reservationId == '' ? null : reservationId
    }

    private mapObject(): any {
        const form = this.form.value
        const reservation = {
            'reservationId': this.isGuid(form.reservationId),
            'date': this.formatDate(form.date),
            'destinationId': form.destinationId,
            'customerId': form.customerId,
            'pickupPointId': form.pickupPointId,
            'portId': form.portId,
            'driverId': form.driverId,
            'shipId': form.shipId,
            'ticketNo': form.ticketNo,
            'email': form.email,
            'phones': form.phones,
            'adults': form.adults,
            'kids': form.kids,
            'free': form.free,
            'remarks': form.remarks,
            'guid': form.guid,
            'userId': form.userId,
            'passengers': this.mapPassengers()
        }
        return reservation
    }

    private mapObjectToVoucher(): any {
        const form = this.form.value
        const voucher = {
            'date': this.formatDate(form.date),
            'destinationDescription': form.destinationDescription,
            'pickupPointDescription': form.pickupPointDescription,
            'pickupPointExactPoint': form.pickupPointExactPoint,
            'pickupPointTime': form.pickupPointTime,
            'remarks': form.remarks,
            'qrcode': form.uri,
            'passengers': this.mapVoucherPassengers()
        }
        console.log('To send', voucher)
        return voucher
    }

    private mapPassengers(): any {
        const passengers = []
        this.form.value.passengers.forEach((element: any) => {
            const passenger = {
                'reservationId': this.isGuid(element.reservationId),
                'occupantId': element.occupantId,
                'nationalityId': element.nationalityId,
                'genderId': element.genderId,
                'lastname': element.lastname,
                'firstname': element.firstname,
                'dob': this.formatDate(element.dob),
                'specialCare': element.specialCare,
                'remarks': element.remarks,
                'isCheckedIn': element.isCheckedIn
            }
            passengers.push(passenger)
        })
        return passengers
    }

    private mapVoucherPassengers(): any {
        const passengers = []
        this.form.value.passengers.forEach((element: any) => {
            const passenger = {
                'lastname': element.lastname,
                'firstname': element.firstname
            }
            passengers.push(passenger)
        })
        return passengers
    }

    private patchFields(result: any, fields: any[]): void {
        if (result) {
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        } else {
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
        }
    }

    private populateDropDowns(): Subscription {
        const sources = []
        sources.push(this.customerService.getAllActive())
        sources.push(this.destinationService.getAllActive())
        sources.push(this.driverService.getAllActive())
        sources.push(this.pickupPointService.getAllActive())
        sources.push(this.portService.getAllActive())
        sources.push(this.shipService.getAllActive())
        return forkJoin(sources).subscribe(
            result => {
                this.customers = result[0]
                this.destinations = result[1]
                this.drivers = result[2]
                this.pickupPoints = result[3]
                this.pickupPointsFlat = this.flattenPickupPoints()
                this.ports = result[4]
                this.ships = result[5]
                this.renameObjects()
            })
    }

    private populateFields(result: Reservation): void {
        this.form.setValue({
            reservationId: result.reservationId,
            date: result.date,
            destinationId: result.destination.id, destinationDescription: result.destination.description,
            customerId: result.customer.id, customerDescription: result.customer.description,
            pickupPointId: result.pickupPoint.id, pickupPointDescription: result.pickupPoint.description, pickupPointExactPoint: result.pickupPoint.exactPoint, pickupPointTime: result.pickupPoint.time,
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            driverId: result.driver.id, driverDescription: result.driver.description,
            portId: result.pickupPoint.route.port.id, portDescription: result.pickupPoint.route.port.description,
            shipId: result.ship.id, shipDescription: result.ship.description,
            ticketNo: result.ticketNo,
            email: result.email,
            phones: result.phones,
            remarks: result.remarks,
            uri: '',
            userId: this.helperService.readItem('userId'),
            passengers: this.flattenDetails(result.passengers)
        })
    }

    private populateFormWithDefaultValues(): void {
        this.form.patchValue({
            reservationId: '',
            date: this.helperService.readItem('date'),
            destinationId: 0, destinationDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            ticketNo: '',
            adults: 0,
            kids: 0,
            free: 0,
            totalPersons: 0,
            driverId: 1, driverDescription: '',
            portId: 1, portDescription: '',
            shipId: 1, shipDescription: '',
            remarks: '',
            uri: '',
            userId: this.helperService.readItem('userId'),
            passengers: []
        })
    }

    private refreshSummary(): void {
        this.interactionService.mustRefreshReservationList()
    }

    private renameKey(obj: any, oldKey: string, newKey: string): void {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects(): void {
        this.destinations.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'destinationId')
            this.renameKey(obj, 'description', 'destinationDescription')
            this.renameKey(obj, 'isActive', 'destinationIsActive')
            this.renameKey(obj, 'userId', 'destinationUserId')
        })
        this.customers.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'customerId')
            this.renameKey(obj, 'description', 'customerDescription')
            this.renameKey(obj, 'isActive', 'customerIsActive')
            this.renameKey(obj, 'userId', 'customerUserId')
        })
        this.drivers.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'driverId')
            this.renameKey(obj, 'description', 'driverDescription')
            this.renameKey(obj, 'isActive', 'driverIsActive')
            this.renameKey(obj, 'userId', 'driverUserId')
        })
        this.ports.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'portId')
            this.renameKey(obj, 'description', 'portDescription')
            this.renameKey(obj, 'isActive', 'portIsActive')
            this.renameKey(obj, 'userId', 'portUserId')
        })
        this.ships.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'shipId')
            this.renameKey(obj, 'description', 'shipDescription')
            this.renameKey(obj, 'isActive', 'shipIsActive')
            this.renameKey(obj, 'userId', 'shipUserId')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private save(): void {
        const reservation: ReservationWriteResource = this.mapObject()
        if (reservation.reservationId == null) {
            this.reservationService.add(reservation).subscribe(() => {
                this.resetForm()
                this.refreshSummary()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
                this.mustStayOnTheList(true)
                this.onGoBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.reservationService.update(this.form.value.reservationId, reservation).subscribe(() => {
                this.resetForm()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                this.mustStayOnTheList(true)
                this.onGoBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showScheduleNotFound(): void {
        this.dialogService.open('errorColor', this.messageSnackbarService.noScheduleFoundWithDetails(), ['ok'])
    }

    private async showModalForm(): Promise<void> {
        document.getElementById('reservationFormModal').style.visibility = 'visible'
    }

    private showModalIndex(elements: any, title: string, fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[]): void {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
            data: {
                records: elements,
                title: title,
                fields: fields,
                headers: headers,
                widths: widths,
                visibility: visibility,
                justify: justify,
                types: types,
                highlightFirstRow: true
            }
        })
        dialog.afterClosed().subscribe((result) => {
            this.patchFields(result, fields)
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private mustStayOnTheList(mustStayOnTheList: boolean): void {
        this.helperService.saveItem('focusOnTheList', mustStayOnTheList.toString())
    }

    private updateTotalPersons(result: { totalPersons: number }): void {
        this.savedTotalPersons = result.totalPersons
    }

    //#endregion

    //#region getters

    get destinationId(): AbstractControl {
        return this.form.get('destinationId')
    }

    get destinationDescription(): AbstractControl {
        return this.form.get('destinationDescription')
    }

    get customerId(): AbstractControl {
        return this.form.get('customerId')
    }

    get customerDescription(): AbstractControl {
        return this.form.get('customerDescription')
    }

    get pickupPointId(): AbstractControl {
        return this.form.get('pickupPointId')
    }

    get pickupPointDescription(): AbstractControl {
        return this.form.get('pickupPointDescription')
    }

    get ticketNo(): AbstractControl {
        return this.form.get('ticketNo')
    }

    get adults(): AbstractControl {
        return this.form.get('adults')
    }

    get kids(): AbstractControl {
        return this.form.get('kids')
    }

    get free(): AbstractControl {
        return this.form.get('free')
    }

    get totalPersons(): AbstractControl {
        return this.form.get('totalPersons')
    }

    get driverId(): AbstractControl {
        return this.form.get('driverId')
    }

    get driverDescription(): AbstractControl {
        return this.form.get('driverDescription')
    }

    get portId(): AbstractControl {
        return this.form.get('portId')
    }

    get portDescription(): AbstractControl {
        return this.form.get('portDescription')
    }

    get shipId(): AbstractControl {
        return this.form.get('shipId')
    }

    get shipDescription(): AbstractControl {
        return this.form.get('shipDescription')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get phones(): AbstractControl {
        return this.form.get('phones')
    }

    get remarks(): AbstractControl {
        return this.form.get('remarks')
    }

    //#endregion

}
