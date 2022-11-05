import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'

@Component({
    selector: 'embarkation-criteria',
    templateUrl: './embarkation-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './embarkation-criteria.component.css']
})

export class EmbarkationCriteriaComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'embarkationCriteria'
    public featureIcon = 'embarkation'
    public form: FormGroup
    public icon = 'home'
    public input: InputTabStopDirective
    public parentUrl = '/'

    public isAutoCompleteDisabled = true
    public destinations: DestinationActiveVM[] = []
    public filteredDestinations: Observable<DestinationActiveVM[]>
    public ports: PortActiveVM[] = []
    public filteredPorts: Observable<PortActiveVM[]>
    public ships: ShipActiveVM[] = []
    public filteredShips: Observable<ShipActiveVM[]>
    public selected: Date | null

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setLocale()
        this.setWindowTitle()
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
        this.clearTableFilters()
        this.navigateToList()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private clearTableFilters(): void {
        this.localStorageService.clearStoredPrimeTableFilters()
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
        this.helperService.focusOnField('destination')
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
        })
    }

    private navigateToList(): void {
        this.router.navigate([
            'date', this.form.value.date,
            'destinationId', this.form.value.destination.id,
            'portId', this.form.value.port.id,
            'shipId', this.form.value.ship.id
        ], { relativeTo: this.activatedRoute })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string, includeWildcard?: boolean): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActive().toPromise().then(
                (response: any) => {
                    this[table] = response
                    if (includeWildcard)
                        this[table].unshift({ 'id': 'all', 'description': '[⭐]' })
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description', true)
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description', true)
        this.populateDropDown(this.shipService, 'ships', 'filteredShips', 'ship', 'description', true)
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.selected = criteria.date
            this.form.setValue({
                date: criteria.date,
                destination: criteria.destination,
                port: criteria.port,
                ship: criteria.ship
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
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

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    //#endregion    

}
