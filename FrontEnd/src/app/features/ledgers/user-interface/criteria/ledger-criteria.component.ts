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
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LedgerCriteriaVM } from '../../classes/view-models/ledger-criteria-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
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

    public selectedFromDate = new Date()
    public selectedToDate = new Date()
    public selectedRangeValue: DateRange<Date>
    private criteria: LedgerCriteriaVM
    public customers: CustomerActiveVM[] = []
    public destinations: DestinationActiveVM[] = []
    public ships: ShipActiveVM[] = []

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private customerService: CustomerService,
        private dateAdapter: DateAdapter<any>,
        private dateHelperService: DateHelperService,
        private formBuilder: FormBuilder,
        private interactionService: InteractionService,
        private localStorageService: LocalStorageService,
        private messageHintService: MessageHintService,
        private messageLabelService: MessageLabelService,
        private router: Router,
    ) { }

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

    public doTasks(): void {
        this.storeCriteria()
        // this.navigateToList()
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
    }

    //#endregion

    //#region private methods

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
            // customers: this.formBuilder.array([], Validators.required),
            // destinations: this.formBuilder.array([], Validators.required),
            // ships: this.formBuilder.array([], Validators.required),
        })
    }

    private navigateToList(): void {
        this.router.navigate([
            'fromDate', this.form.value.fromDate,
            'toDate', this.form.value.toDate,
            'customerId', this.form.value.customer.id,
            'destinationId', this.form.value.destination.id,
            'shipId', this.form.value.ship.id], { relativeTo: this.activatedRoute })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('customers')
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('ledger-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
            this.form.setValue({
                fromDate: this.criteria.fromDate,
                toDate: this.criteria.toDate,
                // customers: this.addSelectedCriteriaFromStorage('customers'),
                // destinations: this.addSelectedCriteriaFromStorage('destinations'),
                // ships: this.addSelectedCriteriaFromStorage('ships'),
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

    //#endregion
    private addSelectedCriteriaFromStorage(arrayName: string): void {
        const x = this.form.controls[arrayName] as FormArray
        this.criteria[arrayName].forEach((element: any) => {
            x.push(new FormControl({
                'id': element.id,
                'description': element.description
            }))
        })
    }

    private setSelectedDates(): void {
        if (this.criteria != undefined) {
            // this.selectedFromDate = new Date(this.criteria.fromDate)
            // this.selectedToDate = new Date(this.criteria.toDate)
            this.selectedRangeValue = new DateRange(new Date(this.criteria.fromDate), new Date(this.criteria.toDate))
        } else {
            // this.selectedFromDate = new Date()
            // this.selectedToDate = new Date()
            this.selectedRangeValue = new DateRange(new Date(), new Date())
            this.form.patchValue({
                fromDate: this.dateHelperService.formatDateToIso(new Date(), false),
                toDate: this.dateHelperService.formatDateToIso(new Date(), false),
            })
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

}
