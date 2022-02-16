import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { Driver } from 'src/app/features/drivers/classes/driver'
import { DriverDropdownResource } from '../../classes/view-models/driver-dropdown-resource'
import { DriverService } from './../../../drivers/classes/driver.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from './../../../../shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-to-driver-form',
    templateUrl: './reservation-to-driver-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-driver-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationToDriverComponent {

    //#region variables

    private feature = 'assignToDriver'
    public drivers: Driver[] = []
    public filteredDrivers: Observable<DriverDropdownResource[]>
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReservationToDriverComponent>, private driverService: DriverService, private formBuilder: FormBuilder, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private ngZone: NgZone, private snackbarService: SnackbarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateDropDowns()
        this.initForm()
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

    public onClose(): void {
        this.dialogRef.close()
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.form.value.driver.id)
        })
    }

    //#endregion

    //#region private methods

    private filterDropdownArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            driver: ['', [Validators.required, ValidationService.RequireAutocomplete]],
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
        this.populateDropDown(this.driverService, 'drivers', 'filteredDrivers', 'driver', 'description')
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get driver(): AbstractControl {
        return this.form.get('driver')
    }

    //#endregion

}
