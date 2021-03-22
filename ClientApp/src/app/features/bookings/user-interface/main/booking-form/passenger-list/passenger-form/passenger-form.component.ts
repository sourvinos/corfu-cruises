import { Component, Inject, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { BookingService } from '../../../../../classes/booking.service'
import { environment } from 'src/environments/environment'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { BookingDetail } from '../../../../../classes/booking-detail'
import { NationalityService } from 'src/app/features/nationalities/classes/nationality.service'
import { GenderService } from 'src/app/features/genders/classes/gender.service'

@Component({
    selector: 'passenger-form',
    templateUrl: './passenger-form.component.html',
    styleUrls: ['../../../../../../../../assets/styles/forms.css', './passenger-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PassengerFormComponent {

    //#region variables

    private feature = 'passengerForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'New Passenger'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    private dobISO = ''
    public bookingDetail = new BookingDetail()
    public genders: any
    public nationalities: any

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private bookingService: BookingService, private buttonClickService: ButtonClickService, private dialogRef: MatDialogRef<PassengerFormComponent>, private dialogService: DialogService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private ngZone: NgZone, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.populateFields(this.data)
    }

    ngAfterViewInit(): void {
        this.focus('lastname')
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.bookingService.delete(this.form.value.bookingId).subscribe(() => {
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
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
        this.form.reset()
        this.ngZone.run(() => {
            this.dialogRef.close()
        })
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
        if (this.form.value.bookingId === 0 || this.form.value.bookingId === null) {
            //     this.bookingService.add(this.form.value).subscribe(() => {
            //         this.initForm()
            //         this.populateFormWithDefaultValues()
            //         this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            //     }, errorCode => {
            //         this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            //     })
        } else {
            this.ngZone.run(() => {
                this.dialogRef.close(this.form.value)
            })
            // this.bookingService.update(this.form.value.bookingId, this.form.value).subscribe(() => {
            //     this.resetForm()
            //     this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            //     this.onGoBack()
            // }, errorCode => {
            //     this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            // })
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

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: this.data.id,
            bookingId: this.data.bookingId,
            occupantId: 2,
            nationalityId: [0, Validators.required], nationalityDescription: ['', Validators.required],
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            dob: ['1985-12-14', [Validators.required, Validators.maxLength(10)]],
            genderId: [0, Validators.required], genderDescription: ['', Validators.required],
            specialCare: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            isCheckedIn: false,
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
        sources.push(this.nationalityService.getAllActive())
        sources.push(this.genderService.getAllActive())
        return forkJoin(sources).subscribe(
            result => {
                this.nationalities = result[0]
                this.genders = result[1]
                this.renameObjects()
            })
    }

    private populateFields(result: any): void {
        this.form.setValue({
            id: result.id,
            bookingId: result.bookingId,
            occupantId: result.occupantId,
            nationalityId: result.nationalityId,
            nationalityDescription: result.nationalityDescription,
            genderId: result.genderId,
            genderDescription: result.genderDescription,
            lastname: result.lastname,
            firstname: result.firstname,
            dob: result.dob,
            specialCare: result.specialCare,
            remarks: result.remarks,
            isCheckedIn: result.isCheckedIn
        })
    }

    private renameKey(obj: any, oldKey: string, newKey: string): void {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects(): void {
        this.nationalities.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'nationalityId')
            this.renameKey(obj, 'description', 'nationalityDescription')
            this.renameKey(obj, 'isActive', 'nationalityIsActive')
            this.renameKey(obj, 'userId', 'nationalityUserId')
        })
        this.genders.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'genderId')
            this.renameKey(obj, 'description', 'genderDescription')
            this.renameKey(obj, 'isActive', 'genderIsActive')
            this.renameKey(obj, 'userId', 'genderUserId')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
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

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    get nationalityId(): AbstractControl {
        return this.form.get('nationalityId')
    }

    get nationalityDescription(): AbstractControl {
        return this.form.get('nationalityDescription')
    }

    get dob(): AbstractControl {
        return this.form.get('dob')
    }

    get genderId(): AbstractControl {
        return this.form.get('genderId')
    }

    get genderDescription(): AbstractControl {
        return this.form.get('genderDescription')
    }

    get specialCare(): AbstractControl {
        return this.form.get('specialCare')
    }

    get remarks(): AbstractControl {
        return this.form.get('remarks')
    }

    get isCheckedIn(): AbstractControl {
        return this.form.get('isCheckedIn')
    }

    //#endregion

}
