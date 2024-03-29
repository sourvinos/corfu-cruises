import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { firstValueFrom, Observable, Subject } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerDropdownVM } from 'src/app/features/customers/classes/view-models/customer-dropdown-vm'
import { DestinationDropdownVM } from 'src/app/features/destinations/classes/view-models/destination-dropdown-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'
import { UserService } from 'src/app/features/users/classes/services/user.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

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

    private userId: string
    public isAdmin: false

    public isAutoCompleteDisabled = true
    public customers: CustomerDropdownVM[] = []
    public filteredCustomers: Observable<CustomerDropdownVM[]>
    public destinations: DestinationDropdownVM[] = []
    public filteredDestinations: Observable<DestinationDropdownVM[]>
    public ships: ShipDropdownVM[] = []
    public filteredShips: Observable<ShipDropdownVM[]>

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router, private userService: UserService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.showConnectedCustomerInDropdown()
        this.setLocale()
        this.subscribeToInteractionService()
        this.focusOnField()
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

    public doTasks(): void {
        this.updateFormWithISODates()
        this.storeCriteria()
        this.navigateToList()
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

    public userMustBeAdmin(): boolean {
        return this.isAdmin
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

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField('fromDate')
    }

    private getConnectedUserId(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.getConnectedUserId()).then((response) => {
                this.userId = response.userId
                resolve(this.userId)
            })
        })
        return promise
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

    private getLinkedCustomer(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.userService.getSingle(this.userId).subscribe(user => {
                if (user.customer.id != 0) {
                    this.form.patchValue({
                        customer: {
                            'id': user.customer.id,
                            'description': user.customer.description
                        }
                    })
                }
                resolve(user)
            })
        })
        return promise
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fromDate: ['', [Validators.required]],
            toDate: ['', [Validators.required]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
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

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string, includeWildCard: boolean) {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        includeWildCard ? this[table].unshift({ 'id': 'all', 'description': '[⭐]' }) : null
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('customers', 'filteredCustomers', 'customer', 'description', true)
        this.populateDropdownFromLocalStorage('destinations', 'filteredDestinations', 'destination', 'description', true)
        this.populateDropdownFromLocalStorage('ships', 'filteredShips', 'ship', 'description', true)
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            this.form.setValue({
                fromDate: criteria.fromDate,
                toDate: criteria.toDate,
                customer: criteria.customer,
                destination: criteria.destination,
                ship: criteria.ship
            })
        } else {
            this.form.patchValue({
                fromDate: this.helperService.getISODate(),
                toDate: this.helperService.getISODate(),
                customer: { id: 'all', description: this.emojiService.getEmoji('wildcard') },
                destination: { id: 'all', description: this.emojiService.getEmoji('wildcard') },
                ship: { id: 'all', description: this.emojiService.getEmoji('wildcard') }
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private showConnectedCustomerInDropdown() {
        this.getConnectedUserId().then(() => {
            this.getConnectedUserRole().then(() => {
                this.getLinkedCustomer()
            })
        })
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('invoicing-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    private updateFormWithISODates(): void {
        this.form.patchValue(
            {
                fromDate: moment(this.form.value.fromDate).utc(true).format('YYYY-MM-DD'),
                toDate: moment(this.form.value.toDate).utc(true).format('YYYY-MM-DD')
            }
        )
    }

    //#endregion

    //#region getters

    get fromDate(): AbstractControl {
        return this.form.get('fromDate')
    }

    get toDate(): AbstractControl {
        return this.form.get('toDate')
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
