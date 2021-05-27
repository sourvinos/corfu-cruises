import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import moment from 'moment'
// Custom
import { Destination } from 'src/app/features/destinations/classes/destination'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Ship } from 'src/app/features/ships/classes/ship'
import { ShipService } from 'src/app/features/ships/classes/ship.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { Port } from 'src/app/features/ports/classes/port'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { ShipRoute } from 'src/app/features/shipRoutes/classes/shipRoute'
import { ShipRouteService } from 'src/app/features/shipRoutes/classes/shipRoute.service'

@Component({
    selector: 'manifest-wrapper',
    templateUrl: './manifest-wrapper.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Manifest'
    public feature = 'manifestWrapper'

    //#endregion

    //#region particular variables

    private dateISO = ''
    public destinations: Destination[] = []
    public ships: Ship[] = []
    public ports: Port[] = []
    public shipRoutes: ShipRoute[] = []
    public selectedShipRouteId: number
    public form: FormGroup
    public openedServerFilters = true

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private portService: PortService, private router: Router, private shipRouteService: ShipRouteService, private shipService: ShipService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDowns()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onLoadManifest(): void {
        if (this.checkValidDate()) {
            this.navigateToList()
            this.close()
        }
    }

    public onUpdateShipRoute(): void {
        this.helperService.saveItem('shipRoute', this.selectedShipRouteId.toString())
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

    public close(): void {
        if (this.openedServerFilters) this.toggleServerFilters()
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            shipId: [0, [Validators.required, ValidationService.isGreaterThanZero]],
            portId: [0, [Validators.required, ValidationService.isGreaterThanZero]],
        })
    }

    private navigateToList(): void {
        this.router.navigate(['date', this.dateISO, 'shipId', this.form.value.shipId, 'portId', this.form.value.portId], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns(): void {
        this.shipService.getAllActive().subscribe((result: any) => {
            this.ships = result
        })
        this.portService.getAllActive().subscribe((result: any) => {
            this.ports = result
        })
        this.shipRouteService.getAllActive().subscribe(result => {
            this.shipRoutes = result
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    public storeShipRoute(): void {
        this.helperService.saveItem('shipRoute', this.selectedShipRouteId.toString())
    }

    public toggleServerFilters(): void {
        this.openedServerFilters = !this.openedServerFilters
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    //#endregion    

}
