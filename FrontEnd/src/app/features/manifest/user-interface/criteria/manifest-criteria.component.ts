import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { ShipDropdownVM } from '../../../ships/classes/view-models/ship-dropdown-vm'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { DestinationDropdownVM } from './../../../destinations/classes/view-models/destination-dropdown-vm'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { Port } from 'src/app/features/ports/classes/models/port'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ShipRoute } from 'src/app/features/shipRoutes/classes/models/shipRoute'
import { ShipRouteService } from 'src/app/features/shipRoutes/classes/services/shipRoute.service'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'manifest-criteria',
    templateUrl: './manifest-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestCriteriaComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Manifest'
    public feature = 'manifestCriteria'
    public input: InputTabStopDirective
    public form: FormGroup
    public destinations: DestinationDropdownVM[] = []
    public ports: Port[] = []
    public ships: ShipDropdownVM[] = []
    public shipRoutes: ShipRoute[]
    public filteredDestinations: Observable<DestinationDropdownVM[]>
    public filteredPorts: Observable<Port[]>
    public filteredShips: Observable<ShipDropdownVM[]>
    public filteredShipRoutes: Observable<ShipRoute[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipRouteService: ShipRouteService, private snackbarService: SnackbarService, private titleService: Title, private shipService: ShipService,) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
        this.populateDropDown(this.shipService, 'ships', 'filteredShips', 'ship', 'description')
        this.populateDropDown(this.shipRouteService, 'shipRoutes', 'filteredShipRoutes', 'shipRoute', 'description')
        this.populateFields()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDoJobs(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.removeCriteria()
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

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private goBack(): void {
        this.router.navigate([this.helperService.getHomePage()])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            shipRoute: ['', [Validators.required, ValidationService.RequireAutocomplete]],
        })
    }

    private navigateToList(): void {
        this.router.navigate([
            'date', moment(this.form.value.date).toISOString().substring(0, 10),
            'destinationId', this.form.value.destination.id,
            'portId', this.form.value.port.id,
            'shipId', this.form.value.ship.id,
            'shipRouteId', this.form.value.shipRoute.id
        ], { relativeTo: this.activatedRoute })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateFields(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.form.setValue({
                date: moment(criteria.date).toISOString(),
                destination: criteria.destination,
                port: criteria.port,
                ship: criteria.ship,
                shipRoute: criteria.shipRoute
            })
        }
    }

    private removeCriteria(): void {
        this.localStorageService.deleteItems([
            'manifestCriteria'
        ])
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('manifest-criteria', JSON.stringify(this.form.value))
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

    get shipRoute(): AbstractControl {
        return this.form.get('shipRoute')
    }

    //#endregion

}
