import moment from 'moment'
import { Component, Inject, NgZone } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { GenderDropdownResource } from '../../classes/resources/form/dropdown/gender-dropdown-resource'
import { GenderService } from 'src/app/features/genders/classes/gender.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { NationalityDropdownResource } from './../../classes/resources/form/dropdown/nationality-dropdown-resource'
import { NationalityService } from 'src/app/features/nationalities/classes/nationality.service'
import { Passenger } from '../../classes/models/passenger'
import { ReservationService } from '../../classes/services/reservation.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { map, startWith } from 'rxjs/operators'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'passenger-form',
    templateUrl: './passenger-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './passenger-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PassengerFormComponent {

    //#region variables

    private feature = 'passengerForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    public filteredGenders: Observable<GenderDropdownResource[]>
    public filteredNationalities: Observable<NationalityDropdownResource[]>
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: Passenger, private dateAdapter: DateAdapter<any>, private dialogRef: MatDialogRef<PassengerFormComponent>, private dialogService: DialogService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private ngZone: NgZone, private reservationService: ReservationService, private snackbarService: SnackbarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.populateFields(this.data)
    }

    ngAfterViewInit(): void {
        this.setLocale()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public dropdownFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.reservationService.delete(this.form.value.reservationId).subscribe(() => {
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                    this.resetForm()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onGoBack(): void {
        this.form.reset()
        this.ngZone.run(() => {
            this.dialogRef.close()
        })
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.flattenPassenger(this.form))
            // this.dialogRef.close(this.form.value)
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
        }, {
            priority: 3,
            inputs: true
        })
    }

    private filterDropdownArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenPassenger(form: FormGroup): any {
        const passenger = {
            'id': form.value.id,
            'reservationId': form.value.reservationId,
            'lastname': form.value.lastname,
            'firstname': form.value.firstname,
            'occupantId': 2,
            'birthdate': moment(form.value.birthdate).format('YYYY-MM-DD'),
            'nationality': form.value.nationality,
            'gender': form.value.gender,
            'specialCare': form.value.specialCare,
            'remarks': form.value.remarks,
            'isCheckedIn': form.value.isCheckedIn
        }
        return passenger
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: this.data.id,
            reservationId: this.data.reservationId,
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required, Validators.maxLength(10)]],
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            specialCare: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            isCheckedIn: false,
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterDropdownArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.nationalityService, 'nationalities', 'filteredNationalities', 'nationality', 'description')
        this.populateDropDown(this.genderService, 'genders', 'filteredGenders', 'gender', 'description')
    }

    private populateFields(result: Passenger): void {
        this.form.setValue({
            id: result.id,
            reservationId: result.reservationId,
            nationality: result.nationality,
            gender: result.gender,
            lastname: result.lastname,
            firstname: result.firstname,
            birthdate: result.birthdate,
            specialCare: result.specialCare,
            remarks: result.remarks,
            isCheckedIn: result.isCheckedIn
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setLocale() {
        this.dateAdapter.setLocale(this.helperService.readLanguage())
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

    get nationality(): AbstractControl {
        return this.form.get('nationality')
    }

    get gender(): AbstractControl {
        return this.form.get('gender')
    }

    get birthdate(): AbstractControl {
        return this.form.get('birthdate')
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
