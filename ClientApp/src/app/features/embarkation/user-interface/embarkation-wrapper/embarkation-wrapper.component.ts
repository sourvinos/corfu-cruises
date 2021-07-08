import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith, takeUntil } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from 'src/app/features/ports/classes/port'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { Ship } from 'src/app/features/ships/base/classes/ship'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'

@Component({
    selector: 'embarkation-wrapper',
    templateUrl: './embarkation-wrapper.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EmbarkationWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationWrapper'
    public input: InputTabStopDirective
    public dateISO = ''
    public destinations: Destination[] = []
    public filteredDestinations: Observable<Destination[]>
    public ports: Port[] = []
    public filteredPorts: Observable<Port[]>
    public ships: Ship[] = []
    public filteredShips: Observable<Ship[]>
    public form: FormGroup
    public openedServerFilters = true
    public navLinks: any[]
    public isVisible: boolean

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDown('destinationService', 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown('portService', 'ports', 'filteredPorts', 'port', 'description')
        this.populateDropDown('shipService', 'ships', 'filteredShips', 'ship', 'description')
        this.subscribeToInteractionService()
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

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onLoadEmbarkation(): void {
        if (this.checkValidDate()) {
            this.navigateToList()
        }
    }

    public onTabClick(event): void {
        console.log(event.index)
        const myHeight = this.helperService.readItem('height')
        document.getElementById('makis').style.height = myHeight
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private checkValidDate(): boolean {
        const date = this.form.value.date
        if (moment(moment(date, 'DD/MM/YYYY')).isValid()) {
            this.dateISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateISO = moment(this.dateISO).format('YYYY-MM-DD')
            return true
        } else {
            this.dateISO = ''
            return false
        }
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

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
        })
    }

    private navigateToList(): void {
        this.router.navigate(['date', this.dateISO, 'destinationId', this.form.value.destination.id, 'portId', this.form.value.port.id, 'shipId', this.form.value.ship.id], { relativeTo: this.activatedRoute })
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

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshEmbarkationList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.onLoadEmbarkation()
        })
    }

    public toggleServerFilters(): void {
        this.openedServerFilters = !this.openedServerFilters
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
