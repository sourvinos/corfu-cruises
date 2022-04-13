import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownVM } from 'src/app/features/customers/classes/view-models/customer-dropdown-vm'
import { CustomerService } from 'src/app/features/customers/classes/services/customer.service'
import { DestinationDropdownVM } from 'src/app/features/destinations/classes/view-models/destination-dropdown-vm'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { GenericResource } from '../../classes/resources/generic-resource'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { EmojiService } from 'src/app/shared/services/emoji.service'

@Component({
    selector: 'invoicing-criteria',
    templateUrl: './invoicing-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './invoicing-criteria.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class InvoicingCriteriaComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'invoicingCriteria'
    public form: FormGroup
    public icon = 'home'
    public input: InputTabStopDirective
    public parentUrl = '/'

    public isAutoCompleteDisabled = true
    public customers: CustomerDropdownVM[] = []
    public filteredCustomers: Observable<CustomerDropdownVM[]>
    public destinations: DestinationDropdownVM[] = []
    public filteredDestinations: Observable<DestinationDropdownVM[]>
    public ships: ShipDropdownVM[] = []
    public filteredShips: Observable<GenericResource[]>
    public selected: Date | null

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private shipService: ShipService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setLocale()
        this.subscribeToInteractionService()
        this.focusOnField()
    }

    ngDoCheck(): void {
        this.form.patchValue({ date: moment(this.selected).utc(true).format('YYYY-MM-DD') })
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

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField('customer')
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
        })
    }

    private navigateToList(): void {
        this.router.navigate(['date', this.form.value.date, 'customerId', this.form.value.customer.id, 'destinationId', this.form.value.destination.id, 'shipId', this.form.value.ship.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    this[table].unshift({ 'id': 'all', 'description': '[⭐]' })
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.customerService, 'customers', 'filteredCustomers', 'customer', 'description')
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.shipService, 'ships', 'filteredShips', 'ship', 'description')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            this.selected = criteria.date
            this.form.setValue({
                date: criteria.date,
                customer: criteria.customer,
                destination: criteria.destination,
                ship: criteria.ship
            })
        } else {
            this.form.patchValue({
                date: new Date().toISOString(),
                customer: { id: 'all', description: '[' + this.emojiService.getEmoji('wildcard') + ']' },
                destination: { id: 'all', description: '[' + this.emojiService.getEmoji('wildcard') + ']' },
                ship: { id: 'all', description: '[' + this.emojiService.getEmoji('wildcard') + ']' }
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('invoicing-criteria', JSON.stringify(this.form.value))
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

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    //#endregion    

}
