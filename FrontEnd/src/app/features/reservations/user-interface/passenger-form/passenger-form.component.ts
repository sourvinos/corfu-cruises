import moment from 'moment'
import { Component, Inject, NgZone } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { firstValueFrom, Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { GenderAutocompleteVM } from 'src/app/features/genders/classes/view-models/gender-autocomplete-vm'
import { AccountService } from 'src/app/shared/services/account.service'
import { GenderService } from 'src/app/features/genders/classes/services/gender.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { NationalityAutocompleteVM } from 'src/app/features/nationalities/classes/view-models/nationality-autocomplete-vm'
import { NationalityService } from 'src/app/features/nationalities/classes/services/nationality.service'
import { PassengerReadVM } from '../../classes/view-models/passenger-read-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'passenger-form',
    templateUrl: './passenger-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './passenger-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PassengerFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'passengerForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = null

    public minBirthDate = new Date(new Date().getFullYear() - 99, 0, 1)
    public maxBirthDate = new Date()

    public isAutoCompleteDisabled = true
    public genderAutocomplete: Observable<GenderAutocompleteVM[]>
    public nationalityAutocomplete: Observable<NationalityAutocompleteVM[]>

    public isAdmin: boolean

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: PassengerReadVM, private accountService: AccountService, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private dialogRef: MatDialogRef<PassengerFormComponent>, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private ngZone: NgZone, private snackbarService: SnackbarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.addShortcuts()
        this.populateDropdowns()
        this.populateFields(this.data)
        this.setLocale()
        this.getConnectedUserRole()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public checkForEmptyAutoComplete(event: { target: { value: any } }) {
        if (event.target.value == '') this.isAutoCompleteDisabled = true
    }

    public enableOrDisableAutoComplete(event: any) {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.flattenForm(this.form))
        })
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
                this.buttonClickService.clickOnButton(event, 'save')
            }
        }, {
            priority: 3,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private assignTempIdToNewPassenger() {
        return Math.round(Math.random() * new Date().getMilliseconds())
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(form: FormGroup): any {
        const passenger = {
            'id': form.value.id == 0 ? this.assignTempIdToNewPassenger() : form.value.id,
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

    private getConnectedUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.isConnectedUserAdmin()).then((response) => {
                this.isAdmin = response
                resolve(this.isAdmin)
            })
        })
        return promise
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: this.data.id,
            reservationId: this.data.reservationId,
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required, Validators.maxLength(10)]],
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
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.genderService, 'genders', 'genderAutocomplete', 'gender', 'description')
        this.populateDropDown(this.nationalityService, 'nationalities', 'nationalityAutocomplete', 'nationality', 'description')
    }

    private populateFields(result: PassengerReadVM): void {
        this.form.setValue({
            id: result.id,
            reservationId: result.reservationId,
            gender: { 'id': result.gender.id, 'description': result.gender.description },
            nationality: { 'id': result.nationality.id, 'description': result.nationality.description },
            lastname: result.lastname,
            firstname: result.firstname,
            birthdate: result.birthdate,
            specialCare: result.specialCare,
            remarks: result.remarks,
            isCheckedIn: result.isCheckedIn
        })
    }

    private setLocale() {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
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
