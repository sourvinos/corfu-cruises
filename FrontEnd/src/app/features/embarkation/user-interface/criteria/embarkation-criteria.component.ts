import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmbarkationCriteriaVM } from '../../classes/view-models/criteria/embarkation-criteria-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

@Component({
    selector: 'embarkation-criteria',
    templateUrl: './embarkation-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css']
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

    private criteria: EmbarkationCriteriaVM
    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()
    public destinations: SimpleEntity[] = []
    public ports: SimpleEntity[] = []
    public ships: SimpleEntity[] = []

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private emojiService: EmojiService, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setSelectedDates()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit(): void {
        this.checkGroupCheckbox('all-destinations', this.destinations, 'destinations')
        this.checkGroupCheckbox('all-ports', this.ports, 'ports')
        this.checkGroupCheckbox('all-ships', this.ships, 'ships')
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public checkboxChange(event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        this.fieldsetCriteriaService.checkboxChange(this.form, event, allCheckbox, formControlsArray, array, description)
    }

    public doTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public filterList(event: { target: { value: any } }, list: string | number): void {
        this.fieldsetCriteriaService.filterList(event.target.value, this[list])
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public lookup(arrayName: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[arrayName].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    public patchFormWithSelectedDates(event: any): void {
        this.form.patchValue({
            fromDate: event.start != null ? this.dateHelperService.formatDateToIso(event.start) : '',
            toDate: event.start != null ? this.dateHelperService.formatDateToIso(event.start) : ''
        })
    }

    public toggleAllCheckboxes(form: FormGroup, array: string, allCheckboxes: string): void {
        this.fieldsetCriteriaService.toggleAllCheckboxes(form, array, allCheckboxes)
    }

    public updateRadioButtons(classname: any, idName: any, id: any, description: any): void {
        const radios = document.getElementsByClassName(classname) as HTMLCollectionOf<HTMLInputElement>
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = false
        }
        const radio = document.getElementById(idName + id) as HTMLInputElement
        radio.checked = true
        const x = this.form.controls[classname] as FormArray
        x.clear()
        x.push(new FormControl({
            'id': id,
            'description': description
        }))
    }

    //#endregion

    //#region private methods

    private addSelectedCriteriaFromStorage(arrayName: string): void {
        const x = this.form.controls[arrayName] as FormArray
        this.criteria[arrayName].forEach((element: any) => {
            x.push(new FormControl({
                'id': element.id,
                'description': element.description
            }))
        })
    }

    private checkGroupCheckbox(allCheckbox: string, array: SimpleEntity[], formControlsArray: string): void {
        this.fieldsetCriteriaService.checkGroupCheckbox(this.form, allCheckbox, array, formControlsArray)
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fromDate: ['', [Validators.required]],
            toDate: ['', [Validators.required]],
            destinations: this.formBuilder.array([], Validators.required),
            ports: this.formBuilder.array([], Validators.required),
            ships: this.formBuilder.array([], Validators.required),
            destinationsFilter: '',
            portsFilter: '',
            shipsFilter: '',
            allDestinationsCheckbox: '',
            allPortsCheckbox: '',
            allShipsCheckbox: ''
        })
    }

    private navigateToList(): void {
        this.localStorageService.deleteItems([
            { 'item': 'scrollTop', 'when': 'always' },
            { 'item': 'line', 'when': 'always' },
        ])
        this.router.navigate(['embarkation/list'])
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ports')
        this.populateDropdownFromLocalStorage('ships')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.form.patchValue({
                fromDate: this.criteria.fromDate,
                toDate: this.criteria.toDate,
                destinations: this.addSelectedCriteriaFromStorage('destinations'),
                ports: this.addSelectedCriteriaFromStorage('ports'),
                ships: this.addSelectedCriteriaFromStorage('ships'),
                allDestinationsCheckbox: this.criteria.allDestinationsCheckbox,
                allPortsCheckbox: this.criteria.allPortsCheckbox,
                allShipsCheckbox: this.criteria.allShipsCheckbox
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setSelectedDates(): void {
        if (this.criteria != undefined) {
            this.selectedRangeValue = new DateRange(new Date(this.criteria.fromDate), new Date(this.criteria.toDate))
        } else {
            this.selectedRangeValue = new DateRange(new Date(), new Date())
            this.form.patchValue({
                fromDate: this.dateHelperService.formatDateToIso(new Date(), false),
                toDate: this.dateHelperService.formatDateToIso(new Date(), false),
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
