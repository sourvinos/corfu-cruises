import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { CustomerActiveVM } from 'src/app/features/customers/classes/view-models/customer-active-vm'
import { CustomerService } from 'src/app/features/customers/classes/services/customer.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LedgerCriteriaVM } from '../../classes/view-models/ledger-criteria-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'

@Component({
    selector: 'ledger-criteria',
    templateUrl: './ledger-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './ledger-criteria.component.css']
})

export class LedgerCriteriaComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'ledgerCriteria'
    public featureIcon = 'ledgers'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = null

    private criteria: LedgerCriteriaVM
    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()
    public customers: CustomerActiveVM[] = []
    public filteredCustomers: CustomerActiveVM[] = []
    public destinations: DestinationActiveVM[] = []
    public filteredDestinations: DestinationActiveVM[] = []
    public ships: ShipActiveVM[] = []
    public filteredShips: ShipActiveVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private router: Router) { }

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

    public clearFilterText(field: string): void {
        this.form.patchValue({ [field]: '' })
    }

    public doTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public filterList(event: { target: { value: any } }, filteredList: string, list: string, listElement: string): void {
        this[filteredList] = this[list]
        const x = event.target.value
        this[filteredList] = this[list].filter(i => i.description.toLowerCase().includes(x.toLowerCase()))
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
            }, 500)
        })
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
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

    public patchFormWithSelectedDates(event: any): void {
        if (event.start != null && event.end != null) {
            this.form.patchValue({
                fromDate: this.dateHelperService.formatDateToIso(event.start, false),
                toDate: this.dateHelperService.formatDateToIso(event.end, false)
            })
        }
    }

    public selectAllText(field: string): void {
        this.helperService.focusOnField(field)
    }

    public toggleAllCheckboxes(array: string, allCheckboxes: string): void {
        const selected = this.form.controls[array + 's'] as FormArray
        const checkboxes = document.querySelectorAll<HTMLInputElement>('.' + array)
        checkboxes.forEach(checkbox => {
            checkbox.checked = !this.form.value[allCheckboxes]
            if (checkbox.checked) {
                selected.push(this.formBuilder.group({
                    id: [checkbox.value, Validators.required],
                    description: document.getElementById(array + '-label' + checkbox.value).innerHTML
                }))
            } else {
                selected.clear()
            }
        })
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

    private getCustomer(): void {
        if (ConnectedUser.customerId != undefined) {
            this.customerService.getSingle(ConnectedUser.customerId).subscribe(response => {
                this.form.patchValue({
                    customer: {
                        'id': response.body.Id,
                        'description': response.body.description
                    }
                })
            })
        }
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fromDate: ['', [Validators.required]],
            toDate: ['', [Validators.required]],
            customers: this.formBuilder.array([], Validators.required),
            destinations: this.formBuilder.array([], Validators.required),
            ships: this.formBuilder.array([], Validators.required),
            customersFilter: '',
            destinationsFilter: '',
            shipsFilter: '',
            allCustomersCheckbox: '',
            allDestinationsCheckbox: '',
            allShipsCheckbox: ''
        })
    }

    private navigateToList(): void {
        this.router.navigate(['ledgers/list'])
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('customers')
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
        this.filteredCustomers = this.customers
        this.filteredDestinations = this.destinations
        this.filteredShips = this.ships
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('ledger-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
            this.form.patchValue({
                fromDate: this.criteria.fromDate,
                toDate: this.criteria.toDate,
                customers: this.addSelectedCriteriaFromStorage('customers'),
                destinations: this.addSelectedCriteriaFromStorage('destinations'),
                ships: this.addSelectedCriteriaFromStorage('ships'),
                customersFilter: '',
                destinationsFilter: '',
                shipsFilter: '',
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('ledger-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
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

    //#endregion

}
