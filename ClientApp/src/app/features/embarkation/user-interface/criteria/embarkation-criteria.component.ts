import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from '../../../destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { Port } from 'src/app/features/ports/classes/port'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { Ship } from 'src/app/features/ships/base/classes/ship'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'embarkation-criteria',
    templateUrl: './embarkation-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class embarkationCriteriaComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationCriteria'
    public input: InputTabStopDirective
    public form: FormGroup
    public destinations: Destination[] = []
    public ports: Port[] = []
    public ships: Ship[] = []
    public filteredDestinations: Observable<Destination[]>
    public filteredPorts: Observable<Port[]>
    public filteredShips: Observable<Ship[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDown('destinationService', 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown('portService', 'ports', 'filteredPorts', 'port', 'description')
        this.populateDropDown('shipService', 'ships', 'filteredShips', 'ship', 'description')
        this.populateFields()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public destinationFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public portFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public shipFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public onGetHint(id: string, minmax = 0): string {
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
            priority: 1,
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
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private goBack(): void {
        this.router.navigate(['/'])
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
        this.router.navigate(['date', moment(this.form.value.date).toISOString().substr(0, 10), 'destinationId', this.form.value.destination.id, 'portId', this.form.value.port.id, 'shipId', this.form.value.ship.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDown(service: string, table: string, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            this[service].getAllActive().toPromise().then(
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
        if (this.helperService.readItem('embarkationCriteria')) {
            const criteria = JSON.parse(this.helperService.readItem('embarkationCriteria'))
            this.form.setValue({
                date: moment(criteria.date).toISOString(),
                destination: criteria.destination,
                port: criteria.port,
                ship: criteria.ship
            })
        }
    }

    private removeCriteria(): void {
        this.helperService.removeItem('embarkationCriteria')
    }
    
    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private storeCriteria(): void {
        this.helperService.saveItem('embarkationCriteria', JSON.stringify(this.form.value))
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
