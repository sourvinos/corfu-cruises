import html2canvas from 'html2canvas'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import moment from 'moment'
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownResource } from '../../classes/resources/form/dropdown/customer-dropdown-resource'
import { CustomerService } from 'src/app/features/customers/classes/services/customer.service'
import { DateAdapter } from '@angular/material/core'
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverDropdownResource } from '../../classes/resources/form/dropdown/driver-dropdown-resource'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { OkIconService } from '../../classes/services/ok-icon.service'
import { PickupPointDropdownResource } from '../../classes/resources/form/dropdown/pickupPoint-dropdown-resource'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { PortDropdownResource } from '../../classes/resources/form/dropdown/port-dropdown-resource'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ReservationReadResource } from '../../classes/resources/form/reservation/reservation-read-resource'
import { ReservationService } from '../../classes/services/reservation.service'
import { ReservationWriteResource } from '../../classes/resources/form/reservation/reservation-write-resource'
import { ShipService } from 'src/app/features/ships/base/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserService } from 'src/app/features/users/classes/user.service'
import { ValidationService } from './../../../../shared/services/validation.service'
import { VoucherService } from '../../classes/services/voucher.service'
import { WarningIconService } from '../../classes/services/warning-icon.service'
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
    private userId: string
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
    public passengerDifferenceIcon: string

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private okIconService: OkIconService, private pickupPointService: PickupPointService, private portService: PortService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, private userService: UserService, private voucherService: VoucherService, private warningIconService: WarningIconService) {
        this.activatedRoute.params.subscribe(x => {
            if (x.id) {
                this.getRecord(x.id).then(() => {
                    this.doPostInitJobs()
                })
            } else {
                this.doPostInitJobs()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.initForm()
        this.subscribeToInteractionService()
        this.readStoredVariables()
        this.setLocale()
    }

    ngOnDestroy(): void {
        this.unsubscribe()
        this.unlisten()
        this.clearStoredVariables()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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

    public checkTotalPersonsAgainstPassengerCount(element?: any): boolean {
        if (this.form.value.passengers) {
            const passengerDifference = this.form.value.totalPersons - (element != null ? element : this.form.value.passengers.length)
            switch (true) {
                case passengerDifference == 0:
                    this.passengerDifferenceIcon = '✔️ '
                    return true
                case passengerDifference < 0:
                    this.passengerDifferenceIcon = '❌ '
                    return false
                case passengerDifference > 0:
                    this.passengerDifferenceIcon = '⚠️ '
                    return true
            }
        }
    }

    public doBarcodeTasks(): void {
        this.createBarcodeFromTicketNo().then(() => {
            this.convertCanvasToBase64()
        })
    }

    public doPersonsCalculations(): void {
        this.calculateTotalPersons()
    }

    public dropdownFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    private getUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.accountService.isConnectedUserAdmin().toPromise().then((response) => {
                this.isAdmin = response
                resolve(this.isAdmin)
            })
        })
        return promise
    }

    public updateFieldsAfterPickupPointSelection(value: PickupPointDropdownResource): void {
        this.form.patchValue({
            exactPoint: value.exactPoint,
            time: value.time,
            port: { 'id': value.port.id, 'description': value.port.description }
        })
    }

    public doVoucherTasksOnClient(): void {
        this.voucherService.createVoucherOnClient(this.mapObjectToVoucher())
    }

    public doVoucherTasksOnServer(): void {
        this.showSnackbar(this.messageSnackbarService.featureNotAvailable(), 'warning')
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
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
        this.router.navigate([this.helperService.readItem('returnUrl')])
    }

    public onSave(): void {
        const reservation: ReservationWriteResource = this.mapObject()
        if (reservation.reservationId.toString() == '') {
            this.reservationService.add(reservation).subscribe((response) => {
                this.resetForm()
                this.onGoBack()
                this.dialogService.open(this.messageSnackbarService.success(), 'infoColor', this.messageSnackbarService.reservationCreated() + this.helperService.formatRefNo(response.message, true), ['ok'])
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        } else {
            this.reservationService.update(this.form.value.reservationId, reservation).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        }
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

    private calculateTotalPersons(): boolean {
        const totalPersons = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPersons: Number(totalPersons) ? totalPersons : 0 })
        return totalPersons > 0 ? true : false
    }

    private clearStoredVariables(): void {
        this.helperService.clearStorageItems(['destinationId', 'destinationDescription'])
    }

    private convertCanvasToBase64(): void {
        setTimeout(() => {
            html2canvas(document.querySelector('#qr-code')).then(canvas => {
                this.form.patchValue({ imageBase64: canvas.toDataURL() })
            })
        }, 500)
    }

    private doPostInitJobs() {
        this.getConnectedUserId().then(() => {
            this.getUserRole().then(() => {
                this.getLinkedCustomer().then(() => {
                    this.populateDropDowns()
                    this.doBarcodeTasks()
                })
            })
        })
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
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private getLinkedCustomer(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.userService.getSingle(this.userId).subscribe(user => {
                if (user.customer.id != 0) {
                    this.form.patchValue({
                        customer: {
                            'id': user.customer.id,
                            'description': user.customer.description
                        }
                    })
                }
                resolve(user)
            })
        })
        return promise
    }

    private getConnectedUserId(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.accountService.getConnectedUserId().toPromise().then((response) => {
                this.userId = response.userId
                resolve(this.userId)
            })
        })
        return promise
    }

    private getValidPassengerIconForVoucher(isValid: boolean): string {
        if (isValid) {
            return this.okIconService.getIcon()
        } else {
            return this.warningIconService.getIcon()
        }
    }

    private getRecord(id: number): Promise<any> {
        const promise = new Promise((resolve) => {
            this.reservationService.getSingle(id).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                this.onGoBack()
            })
        })
        return promise
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: '',
            refNo: '',
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            pickupPoint: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            exactPoint: '',
            time: '',
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPersons: ['0', ValidationService.isGreaterThanZero],
            driver: '',
            port: '',
            ship: '',
            ticketNo: ['', [Validators.required, Validators.maxLength(128)]],
            email: ['', [Validators.maxLength(128), Validators.email]],
            phones: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            imageBase64: '',
            passengers: [[]]
        })
    }

    private isGuid(reservationId: string): any {
        return reservationId == '' ? null : reservationId
    }

    private mapObject(): any {
        const form = this.form.value
        const reservation = {
            'reservationId': form.reservationId,
            'date': moment(form.date).format('YYYY-MM-DD'),
            'refNo': form.refNo,
            'customerId': form.customer.id,
            'destinationId': form.destination.id,
            'driverId': form.driver ? form.driver.id : null,
            'pickupPointId': form.pickupPoint.id,
            'portId': form.port.id,
            'shipId': form.ship ? form.ship.id : null,
            'ticketNo': form.ticketNo,
            'email': form.email,
            'phones': form.phones,
            'adults': form.adults,
            'kids': form.kids,
            'free': form.free,
            'remarks': form.remarks,
            'passengers': this.mapPassengers()
        }
        return reservation
    }

    private mapObjectToVoucher(): any {
        const form = this.form.value
        const voucher = {
            'date': form.date,
            'destinationDescription': form.destination.description,
            'customerDescription': form.customer.description,
            'pickupPointDescription': form.pickupPoint.description,
            'pickupPointExactPoint': form.pickupPoint.exactPoint,
            'pickupPointTime': form.pickupPoint.time,
            'adults': form.adults,
            'kids': form.kids,
            'free': form.free,
            'totalPersons': form.totalPersons,
            'driverDescription': form.driver.description,
            'ticketNo': form.ticketNo,
            'remarks': form.remarks,
            'validPassengerIcon': this.getValidPassengerIconForVoucher(this.validatePassengerCountForVoucher(form.totalPersons, form.passengers)),
            'qr': form.ticketNo,
            'passengers': this.mapVoucherPassengers()
        }
        return voucher
    }

    private mapPassengers(): any {
        const passengers = []
        this.form.value.passengers.forEach((passenger: any) => {
            const x = {
                'reservationId': this.isGuid(passenger.reservationId),
                'genderId': passenger.gender.id,
                'nationalityId': passenger.nationality.id,
                'occupantId': 2,
                'lastname': passenger.lastname,
                'firstname': passenger.firstname,
                'birthdate': passenger.birthdate,
                'specialCare': passenger.specialCare,
                'remarks': passenger.remarks,
                'isCheckedIn': passenger.isCheckedIn
            }
            passengers.push(x)
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
            service.getActiveForDropdown().toPromise().then(
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
            refNo: result.refNo,
            destination: { 'id': result.destination.id, 'description': result.destination.description },
            customer: { 'id': result.customer.id, 'description': result.customer.description },
            pickupPoint: { 'id': result.pickupPoint.id, 'description': result.pickupPoint.description, 'exactPoint': result.pickupPoint.exactPoint, 'time': result.pickupPoint.time },
            exactPoint: result.pickupPoint.exactPoint,
            time: result.pickupPoint.time,
            driver: { 'id': result.driver.id, 'description': result.driver.description },
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            port: { 'id': result.pickupPoint.port.id, 'description': result.pickupPoint.port.description },
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            ticketNo: result.ticketNo,
            email: result.email,
            phones: result.phones,
            remarks: result.remarks,
            imageBase64: '',
            passengers: result.passengers
        })
    }

    private readStoredVariables() {
        this.form.patchValue({
            date: this.helperService.readItem('date'),
            destination: {
                'id': this.helperService.readItem('destinationId'),
                'description': this.helperService.readItem('destinationDescription')
            }
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setLocale() {
        this.dateAdapter.setLocale(this.helperService.readLanguage())
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    private validatePassengerCountForVoucher(reservationPersons: any, passengerCount: any): boolean {
        if (reservationPersons == passengerCount.length) {
            return true
        } else {
            return false
        }
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get refNo(): AbstractControl {
        return this.form.get('refNo')
    }

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
