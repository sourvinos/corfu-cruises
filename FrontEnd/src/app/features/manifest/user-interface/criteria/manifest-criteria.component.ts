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
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
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

    private criteria: any
    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()
    public destinations: DestinationActiveVM[] = []
    public filteredDestinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public filteredPorts: PortActiveVM[] = []
    public ships: ShipActiveVM[] = []
    public filteredShips: ShipActiveVM[] = []
    public shipRoutes: ShipRouteActiveVM[]
    public filteredShipRoutes: ShipRouteActiveVM[]

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private emojiService: EmojiService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setSelectedDates()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public filterList(event: { target: { value: any } }, filteredList: string, list: string, listElement: string): void {
        this[filteredList] = this[list]
        const x = event.target.value
        this[filteredList] = this[list].filter((i: { description: string }) => i.description.toLowerCase().includes(x.toLowerCase()))
        setTimeout(() => {
            const criteria = this.form.value[list]
            criteria.forEach((element: { description: any }) => {
                this[filteredList].forEach((x: { description: any; id: string }) => {
                    if (element.description == x.description) {
                        const input = document.getElementById(listElement + x.id) as HTMLInputElement
                        if (input != null) {
                            input.checked = true
                        }
                    }
                })
            }, 1000)
        })
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

    public onCheckboxChange(event: any, allCheckbox: string, formControlsArray: string, description: string): void {
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
        if (selected.length == 0) {
            document.querySelector<HTMLInputElement>('#all-' + formControlsArray).checked = false
            this.form.patchValue({
                [allCheckbox]: false
            })
        } else {
            if (selected.length == this[formControlsArray].length) {
                document.querySelector<HTMLInputElement>('#all-' + formControlsArray).checked = true
                this.form.patchValue({
                    [allCheckbox]: true
                })
            }
        }
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

    public toggleAllCheckboxes(array: string, allCheckboxes: string): void {
        const selected = this.form.controls[array + 's'] as FormArray
        selected.clear()
        const checkboxes = document.querySelectorAll<HTMLInputElement>('.' + array)
        checkboxes.forEach(checkbox => {
            checkbox.checked = !this.form.value[allCheckboxes]
            if (checkbox.checked) {
                selected.push(this.formBuilder.group({
                    id: [checkbox.value, Validators.required],
                    description: document.getElementById(array + '-label' + checkbox.value).innerHTML
                }))
            }
        })
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

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
        this.populateDropdownFromLocalStorage('ports')
        this.populateDropdownFromLocalStorage('shipRoutes')
        this.filteredDestinations = this.destinations
        this.filteredPorts = this.ports
        this.filteredShips = this.ships
        this.filteredShipRoutes = this.shipRoutes
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
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
        this.localStorageService.saveItem('manifest-criteria-panel', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

}
