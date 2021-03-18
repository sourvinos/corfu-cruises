import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { CustomerService } from 'src/app/features/customers/classes/customer.service'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { Booking } from '../../../classes/booking'
import { BookingService } from '../../../classes/booking.service'
import { PickupPointFlat } from '../../../../pickupPoints/classes/pickupPoint-flat'
import { environment } from 'src/environments/environment'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipService } from 'src/app/features/ships/classes/ship.service'
import { BookingDetail } from '../../../classes/booking-detail'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'booking-form',
    templateUrl: './booking-form.component.html',
    styleUrls: ['../../../../../../assets/styles/forms.css', './booking-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BookingFormComponent {

    //#region variables

    private feature = 'bookingForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '../../'
    private windowTitle = 'Booking'
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
    public highlightFirstRow = false
    public booking = new Booking()
    public pickupPointsFlat: PickupPointFlat[]
    public message = ''

    public qrCodeValue = "www.corfucruises.com"
    public errorCorrectionLevel = "H"
    public margin = 4
    public width = "128"

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private bookingService: BookingService, private buttonClickService: ButtonClickService, private customerService: CustomerService, private destinationService: DestinationService, private dialogService: DialogService, private driverService: DriverService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
            } else {
                setTimeout(() => {
                    this.populateFormWithDefaultValues()
                }, 1000)
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
    }

    ngDoCheck(): void {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.form.patchValue({ details: response })
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

    public onCalculateTotalPersons(): void {
        const totalPersons = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPersons: Number(totalPersons) ? totalPersons : 0 })
    }

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.bookingService.delete(this.form.value.bookingId).subscribe(() => {
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                    this.interactionService.removeTableRow(this.getRowIndex(this.form.value.bookingId))
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

    public onLookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[], value: { target: { value: any } }): void {
        const filteredArray = []
        lookupArray.filter(x => {
            const key = fields[1]
            if (x[key].toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
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

    public onSave(): void {
        console.log(this.form.value)
        if (this.form.value.bookingId === 0 || this.form.value.bookingId === null) {
            this.bookingService.add(this.form.value).subscribe(() => {
                this.initForm()
                this.populateFormWithDefaultValues()
                this.refreshSummary()
                this.focus('destinationDescription')
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.bookingService.update(this.form.value.bookingId, this.form.value).subscribe(() => {
                this.resetForm()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                this.onGoBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    public onSendVoucher(): void {
        this.bookingService.sendVoucher(this.form.value).subscribe(() => {
            this.showSnackbar(this.messageSnackbarService.emailSent(), 'info')
        }, () => {
            this.showSnackbar(this.messageSnackbarService.invalidModel(), 'error')
        })
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onCalculateTotalPersons()
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

    private flattenDetails(details: BookingDetail[]): any {
        const detailsFlat = []
        details.forEach(detail => {
            const detailFlat = {
                "id": detail.id,
                "bookingId": detail.bookingId,
                "occupantId": detail.occupant.id,
                "nationalityId": detail.nationality.id,
                "nationalityDescription": detail.nationality.description,
                "lastname": detail.lastname,
                "firstname": detail.firstname,
                "dob": detail.dob.substr(0, 10),
                "email": detail.email,
                "phones": detail.phones,
                "specialCare": detail.specialCare,
                "remarks": detail.remarks,
                "isCheckedIn": detail.isCheckedIn
            }
            detailsFlat.push(detailFlat)
        })
        return detailsFlat
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

    private getRecord(id: number): void {
        this.bookingService.getSingle(id).subscribe(result => {
            this.showModalForm()
            this.populateFields(result)
            this.focus('destinationDescription')
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
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
        document.getElementById('bookingFormModal').style.visibility = "hidden"
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            bookingId: 0,
            date: '',
            destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
            customerId: [0, Validators.required], customerDescription: ['', Validators.required],
            pickupPointId: [0, Validators.required], pickupPointDescription: ['', Validators.required],
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPersons: [{ value: '0', disabled: true }, Validators.required],
            driverId: [1, Validators.required], driverDescription: [{ value: '', disabled: true }, Validators.required],
            portId: [1, Validators.required], portDescription: [{ value: '', disabled: true }, Validators.required],
            shipId: [1, Validators.required], shipDescription: [{ value: '', disabled: true }, Validators.required],
            email: ['', Validators.maxLength(128)],
            phones: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            userId: this.helperService.readItem('userId'),
            details: []
        })
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

    private populateFields(result: Booking): void {
        this.form.setValue({
            bookingId: result.bookingId,
            date: result.date,
            destinationId: result.destination.id, destinationDescription: result.destination.description,
            customerId: result.customer.id, customerDescription: result.customer.description,
            pickupPointId: result.pickupPoint.id, pickupPointDescription: result.pickupPoint.description,
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            driverId: result.driver.id, driverDescription: result.driver.description,
            portId: result.pickupPoint.route.port.id, portDescription: result.pickupPoint.route.port.description,
            shipId: result.ship.id, shipDescription: result.ship.description,
            email: result.email,
            phones: result.phones,
            remarks: result.remarks,
            userId: this.helperService.readItem('userId'),
            details: this.flattenDetails(result.details)
        })
    }

    private populateFormWithDefaultValues(): void {
        this.form.patchValue({
            bookingId: 0,
            date: this.helperService.readItem('date'),
            destinationId: 0, destinationDescription: '',
            customerId: 0, customerDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            adults: 0,
            kids: 0,
            free: 0,
            totalPersons: 0,
            driverId: 1, driverDescription: '',
            portId: 1, portDescription: '',
            shipId: 1, shipDescription: '',
            remarks: '',
            userId: this.helperService.readItem('userId')
        })
    }

    private refreshSummary(): void {
        this.interactionService.mustRefreshList()
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

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private async showModalForm(): Promise<void> {
        document.getElementById('bookingFormModal').style.visibility = 'visible'
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
