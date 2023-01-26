import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { ManifestCriteriaVM } from '../../classes/view-models/criteria/manifest-criteria-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PortActiveVM } from './../../../ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'
import { ShipRouteActiveVM } from 'src/app/features/shipRoutes/classes/view-models/shipRoute-active-vm'

@Component({
    selector: 'manifest-criteria',
    templateUrl: './manifest-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css']
})

export class ManifestCriteriaComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'manifestCriteria'
    public featureIcon = 'manifest'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = null

    private criteria: ManifestCriteriaVM
    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()
    public destinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public ships: ShipActiveVM[] = []
    public shipRoutes: ShipRouteActiveVM[]

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
        this.checkGroupCheckbox('allPortsCheckbox', 'ports')
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public filterList(event: { target: { value: any } }, list: string | number): void {
        this.fieldsetCriteriaService.filterList(event.target.value, this[list])
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public lookup(array: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[array].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    public onCheckboxChange(event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        this.fieldsetCriteriaService.checkboxChange(this.form, event, allCheckbox, formControlsArray, array, description)
    }

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
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

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
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

    private checkGroupCheckbox(allCheckbox: string, formControlsArray: string): void {
        this.fieldsetCriteriaService.checkGroupCheckbox(this.form, 'all-ports', this.ports, formControlsArray)
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
            shipRoutes: this.formBuilder.array([], Validators.required),
            destinationsFilter: '',
            portsFilter: '',
            shipsFilter: '',
            shipRoutesFilter: '',
            allDestinationsCheckbox: '',
            allPortsCheckbox: '',
            allShipsCheckbox: '',
            allShipRoutesCheckbox: ''
        })
    }

    private navigateToList(): void {
        this.router.navigate(['manifest/list'])
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
        this.populateDropdownFromLocalStorage('ports')
        this.populateDropdownFromLocalStorage('shipRoutes')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.form.patchValue({
                fromDate: this.criteria.fromDate,
                toDate: this.criteria.toDate,
                destinations: this.addSelectedCriteriaFromStorage('destinations'),
                ports: this.addSelectedCriteriaFromStorage('ports'),
                ships: this.addSelectedCriteriaFromStorage('ships'),
                shipRoutes: this.addSelectedCriteriaFromStorage('shipRoutes')
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
        this.localStorageService.saveItem('manifest-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

}
