import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
import html2canvas from 'html2canvas'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownResource } from '../../classes/resources/form/dropdown/customer-dropdown-resource'
import { CustomerService } from 'src/app/features/customers/classes/customer.service'
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverDropdownResource } from '../../classes/resources/form/dropdown/driver-dropdown-resource'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PickupPointDropdownResource } from '../../classes/resources/form/dropdown/pickupPoint-dropdown-resource'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { PortDropdownResource } from '../../classes/resources/form/dropdown/port-dropdown-resource'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { ReservationReadResource } from '../../classes/resources/form/reservation/reservation-read-resource'
import { ReservationService } from '../../classes/services/reservation.service'
import { ReservationWriteResource } from '../../classes/resources/form/reservation/reservation-write-resource'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserService } from 'src/app/features/users/classes/user.service'
import { ValidationService } from './../../../../shared/services/validation.service'
import { VoucherService } from '../../classes/services/voucher.service'
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
    private windowTitle = 'Reservation'
    public form: FormGroup
    public input: InputTabStopDirective
    public isAdmin: boolean

    //#endregion

    //#region particular variables

    public barcode = { 'ticketNo': '', 'size': 128, 'level': 'M' }
    public filteredDestinations: Observable<Destination[]>
    public filteredCustomers: Observable<CustomerDropdownResource[]>
    public filteredPickupPoints: Observable<PickupPointDropdownResource[]>
    public filteredDrivers: Observable<DriverDropdownResource[]>
    public filteredShips: Observable<DriverDropdownResource[]>
    public filteredPorts: Observable<PortDropdownResource[]>

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private helperService: HelperService,  private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private portService: PortService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService, private voucherService: VoucherService) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.populateDropDowns()
        this.initForm()
        this.populateFormWithDefaultValues()
        this.getUserRole()
        this.getCustomer()
    }

    ngOnDestroy(): void {
        this.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.onGoBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    //#endregion

    //#region public methods

    public calculateTotalPersons(): boolean {
        const totalPersons = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPersons: Number(totalPersons) ? totalPersons : 0 })
        return totalPersons > 0 ? true : false
    }

    public dropdownFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public doBarcodeTasks(): void {
        this.createBarcodeFromTicketNo().then(() => {
            this.convertCanvasToBase64()
        })
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
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
                    this.resetForm()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onGoBack(): void {
        this.router.navigate([this.activatedRoute.snapshot.queryParams['returnUrl']])
    }

    public onSave(): void {
        const reservation: ReservationWriteResource = this.mapObject()
        if (reservation.reservationId == null) {
            this.reservationService.add(reservation).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.reservationService.update(this.form.value.reservationId, reservation).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    public updatePort(value: PickupPointDropdownResource): void {
        this.form.patchValue({ port: { 'id': value.port.id, 'description': value.port.description } })
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    if (this.calculateTotalPersons())
                        this.buttonClickService.clickOnButton(event, 'save')
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private convertCanvasToBase64(): void {
        setTimeout(() => {
            html2canvas(document.querySelector('#qr-code')).then(canvas => {
                this.form.patchValue({ imageBase64: canvas.toDataURL() })
            })
        }, 500)
    }

    private createBarcodeFromTicketNo(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.barcode.ticketNo = this.form.value.ticketNo
            resolve(this.ticketNo)
        })
        return promise
    }

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private getCustomer(): void {
        const userId = this.helperService.readItem('userId')
        this.userService.getSingle(userId).subscribe(user => {
            this.customerService.getSingle(user.customerId).subscribe(customer => {
                this.form.patchValue({ customerId: customer.id })
                this.form.patchValue({ customerDescription: customer.description })
            })
        })
    }

    private getRecord(id: number): void {
        this.reservationService.getSingle(id).subscribe(result => {
            this.populateFields(result)
            this.doBarcodeTasks()
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private getUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.accountService.isAdmin(this.helperService.readItem('userId')).toPromise().then(
                (response) => {
                    this.isAdmin = response.isAdmin
                    resolve(this.isAdmin)
                })
        })
        return promise
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: this.helperService.formatDateToISO(JSON.parse(this.helperService.readItem('dashboard')).date),
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            pickupPoint: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPersons: ['0', ValidationService.isGreaterThanZero],
            driver: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ticketNo: ['', [Validators.required, Validators.maxLength(128)]],
            email: ['', [Validators.maxLength(128), Validators.email]],
            phones: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            userId: this.helperService.readItem('userId'),
            imageBase64: '',
            passengers: []
        })
    }

    private isGuid(reservationId: string): any {
        return reservationId == '' ? null : reservationId
    }

    private mapObject(): any {
        const form = this.form.value
        const reservation = {
            'reservationId': this.isGuid(form.reservationId),
            'date': this.helperService.formatDateToISO(form.date),
            'destinationId': form.destination.id,
            'customerId': form.customer.id,
            'pickupPointId': form.pickupPoint.id,
            'portId': form.port.id,
            'driverId': form.driver.id,
            'shipId': form.ship.id,
            'ticketNo': form.ticketNo,
            'email': form.email,
            'phones': form.phones,
            'adults': form.adults,
            'kids': form.kids,
            'free': form.free,
            'remarks': form.remarks,
            'userId': form.userId,
            'passengers': this.mapPassengers()
        }
        return reservation
    }

    private mapObjectToVoucher(): any {
        const form = this.form.value
        const voucher = {
            'date': this.helperService.formatDateToISO(form.date),
            'destinationDescription': form.destination.description,
            'pickupPointDescription': form.pickupPoint.description,
            'pickupPointExactPoint': form.pickupPoint.exactPoint,
            'pickupPointTime': form.pickupPoint.time,
            'remarks': form.remarks,
            'qr': form.ticketNo,
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
                'occupantId': 2,
                'nationalityId': element.nationality.id,
                'genderId': element.gender.id,
                'lastname': element.lastname,
                'firstname': element.firstname,
                'birthdate': this.helperService.formatDateToISO(element.birthdate),
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

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getAllActive().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description')
        this.populateDropDown(this.pickupPointService, 'pickupPoints', 'filteredPickupPoints', 'pickupPoint', 'description')
        this.populateDropDown(this.driverService, 'drivers', 'filteredDrivers', 'driver', 'description')
        this.populateDropDown(this.shipService, 'ships', 'filteredShips', 'ship', 'description')
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
    }

    private populateFields(result: ReservationReadResource): void {
        this.form.setValue({
            reservationId: result.reservationId,
            date: result.date,
            destination: { 'id': result.destination.id, 'description': result.destination.description },
            customer: { 'id': result.customer.id, 'description': result.customer.description },
            pickupPoint: { 'id': result.pickupPoint.id, 'description': result.pickupPoint.description, 'exactPoint': result.pickupPoint.exactPoint, 'time': result.pickupPoint.time },
            driver: { 'id': result.driver.id, 'description': result.driver.description },
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            port: { 'id': result.port.id, 'description': result.port.description },
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            ticketNo: result.ticketNo,
            email: result.email,
            phones: result.phones,
            remarks: result.remarks,
            imageBase64: '',
            userId: this.helperService.readItem('userId'),
            passengers: result.passengers
        })
    }

    private populateFormWithDefaultValues(): void {
        this.form.patchValue({
            driver: { 'id': 1, 'description': '-' },
            port: { 'id': 1, 'description': '-' },
            ship: { 'id': 1, 'description': '-' },
            passengers: []
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region getters

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get pickupPoint(): AbstractControl {
        return this.form.get('pickupPoint')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get driver(): AbstractControl {
        return this.form.get('driver')
    }

    get port(): AbstractControl {
        return this.form.get('port')
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
