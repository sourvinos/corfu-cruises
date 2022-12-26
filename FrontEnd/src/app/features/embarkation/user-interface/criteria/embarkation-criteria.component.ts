import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { MatCalendar } from '@angular/material/datepicker'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { EmbarkationCriteriaVM } from '../../classes/view-models/embarkation-criteria-vm'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'embarkation-criteria',
    templateUrl: './embarkation-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './embarkation-criteria.component.css']
})

export class EmbarkationCriteriaComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'embarkationCriteria'
    public featureIcon = 'embarkation'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = null

    public selectedDate = new Date()
    private criteria: EmbarkationCriteriaVM
    public destinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public ships: ShipActiveVM[] = []

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private router: Router,) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setSelectedDate()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoToday(): void {
        this.selectedDate = new Date()
        this.form.patchValue({ date: this.selectedDate.toISOString().substring(0, 10) })
        this.calendar._goToDateInView(this.selectedDate, 'month')
    }

    /**
     * Scans the criteria which are loaded from the storage
     * @param arrayName 
     * @param arrayId 
     * @returns True or false so that the checkbox can be checked or left empty
     */
    public lookup(arrayName: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[arrayName].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    /**
     * Adds/removes controls to/from the formArray
     * @param event
     * @param formControlsArray
     * @param description 
     */
    public onCheckboxChange(event: any, formControlsArray: string, description: string): void {
        const selected = this.form.controls[formControlsArray] as FormArray
        if (event.target.checked) {
            selected.push(this.formBuilder.group({
                id: [parseInt(event.target.value), Validators.required],
                description: [description]
            }))
        } else {
            const index = selected.controls.findIndex(x => x.value.id == parseInt(event.target.value))
            selected.removeAt(index)
        }
    }

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public selectDateFromCalendar(selected: Date): void {
        this.form.patchValue({
            date: this.dateHelperService.formatDateToIso(selected, false)
        })
    }

    //#endregion

    //#region private methods

    /**
     * Adds all the stored criteria from the storage to the form.
     * Called on every page load (when called from the menu or when returning from the embarkation list)
     */
    private addSelectedCriteriaFromStorage(arrayName: string): void {
        const x = this.form.controls[arrayName] as FormArray
        this.criteria[arrayName].forEach((element: any) => {
            x.push(new FormControl({
                'id': element.id,
                'description': element.description
            }))
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required, ValidationService.RequireDate]],
            destinations: this.formBuilder.array([], Validators.required),
            ports: this.formBuilder.array([], Validators.required),
            ships: this.formBuilder.array([], Validators.required)
        })
    }

    private navigateToList(): void {
        this.router.navigate(['embarkation/list'])
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ports')
        this.populateDropdownFromLocalStorage('ships')
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.form.patchValue({
                date: this.criteria.date,
                destinations: this.addSelectedCriteriaFromStorage('destinations'),
                ports: this.addSelectedCriteriaFromStorage('ports'),
                ships: this.addSelectedCriteriaFromStorage('ships'),
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    /**
     * Sets the selected date to today or whatever is stored
     */
    private setSelectedDate(): void {
        if (this.criteria != undefined) {
            this.selectedDate = new Date(this.criteria.date)
        } else {
            this.selectedDate = new Date()
            this.form.patchValue({
                date: this.dateHelperService.formatDateToIso(this.selectedDate, false)
            })
        }
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('embarkation-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

}
