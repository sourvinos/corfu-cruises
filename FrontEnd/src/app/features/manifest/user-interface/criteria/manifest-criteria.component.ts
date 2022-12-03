import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms'
import { MatCalendar, MatDatepickerInputEvent } from '@angular/material/datepicker'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'manifest-criteria',
    templateUrl: './manifest-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './manifest-criteria.component.css']
})

export class ManifestCriteriaComponent {

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    //#region variables

    private unsubscribe = new Subject<void>()
    public feature = 'manifestCriteria'
    public featureIcon = 'manifest'
    public form: FormGroup
    public icon = 'home'
    public input: InputTabStopDirective
    public parentUrl = null

    private criteria: any
    public destinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public ships: ShipActiveVM[] = []
    public selectedDate = new Date()

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router) { }

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

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoDate(selected: Date): void {
        this.form.patchValue({
            date: this.dateHelperService.formatDateToIso(selected, false)
        })
    }

    public gotoToday(): void {
        this.form.patchValue({ date: new Date().toISOString().substring(0, 10) })
        this.selectedDate = new Date()
        this.calendar._goToDateInView(this.selectedDate, 'month')
    }

    public lookupPort(id: any): boolean {
        return this.criteria ? this.criteria.portIds.findIndex((book: any) => book == id) > -1 : false
    }

    public onCheckboxChange(event: any, controlName: string): void {
        const selectedItems = (this.form.controls[controlName] as FormArray)
        if (event.target.checked) {
            selectedItems.push(new FormControl(event.target.value))
        } else {
            const index = selectedItems.controls.findIndex(x => x.value === event.target.value)
            selectedItems.removeAt(index)
        }
    }

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public updateField(type: string, event: MatDatepickerInputEvent<Date>): void {
        this.form.patchValue({ date: this.dateHelperService.formatDateToIso(new Date(event.value != null ? event.value : ''), false) })
    }

    //#endregion

    //#region private methods

    private addPorts(): void {
        const selectedPorts = this.form.controls['portIds'] as FormArray
        this.criteria.portIds.forEach((portId: any) => {
            selectedPorts.push(new FormControl(portId))
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required, ValidationService.RequireDate]],
            destinationId: ['', [Validators.required]],
            portIds: this.formBuilder.array([], [Validators.required]),
            shipId: ['', [Validators.required]]
        })
    }

    private navigateToList(): void {
        this.router.navigate(['manifest/list'])
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
        this.populateDropdownFromLocalStorage('ports')
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.form.patchValue({
                date: this.criteria.date,
                destinationId: this.criteria.destinationId,
                portIds: this.addPorts(),
                shipId: this.criteria.shipId
            })
        }
    }

    private setSelectedDate(): void {
        if (this.criteria != undefined) {
            this.selectedDate = new Date(this.criteria.date)
        } else {
            this.selectedDate = new Date()
            this.form.patchValue({
                date: this.selectedDate
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('manifest-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destinationId(): AbstractControl {
        return this.form.get('destinationId')
    }

    get portIds(): AbstractControl {
        return this.form.get('portIds') as FormArray
    }

    get shipId(): AbstractControl {
        return this.form.get('shipId')
    }

    //#endregion

}
