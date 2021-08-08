import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestViewModel } from '../../classes/view-models/manifest-view-model'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ShipRouteService } from 'src/app/features/ships/routes/classes/shipRoute.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'manifestList'
    private unlisten: Unlisten
    private windowTitle = 'Manifest'
    public feature = 'manifestList'
    public records: ManifestViewModel
    public selectedShipRoute: any
    public passengerCount = 0
    public crewCount = 0

    public genders = []
    public nationalities = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: ManifestPdfService, private router: Router, private shipRouteService: ShipRouteService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.loadRecords()
        this.calculateTotals()
        this.addCrewToPassengers()
        this.getDistinctGenders()
        this.getDistinctNationalities()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onCreatePdf(): void {
        this.updateShipRoute().then(() => {
            this.pdfService.createReport(this.selectedShipRoute, this.records)
        })
    }

    public onFormatDate(date: string): string {
        return this.helperService.formatDateToLocale(date)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public goBack(): void {
        this.router.navigate(['/manifest'])
    }

    //#endregion

    //#region private methods

    private addCrewToPassengers(): void {
        this.records.ship.crew.forEach(crew => {
            this.records.passengers.push(crew)
        })
    }

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.S': () => {
                this.focus('searchTerm')
            },
            'Alt.E': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'exportToPDF')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private calculateTotals(): void {
        this.passengerCount = this.records.passengers.length
        this.crewCount = this.records.ship.crew.length
    }

    private focus(element: string): void {
        this.helperService.setFocus(element)
    }

    private getDistinctGenders(): void {
        let array = []
        array = [... new Set(this.records.passengers.map(x => x.genderDescription))]
        array.forEach(element => {
            this.genders.push({ label: element, value: element })
        })
    }

    private getDistinctNationalities(): void {
        let array = []
        array = [... new Set(this.records.passengers.map(x => x.nationalityDescription))]
        array.forEach(element => {
            this.nationalities.push({ label: element, value: element })
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updateShipRoute(): Promise<any> {
        return new Promise((resolve) => {
            this.shipRouteService.getSingle(this.helperService.readItem('shipRoute')).subscribe(result => {
                this.selectedShipRoute = result
                resolve(this.selectedShipRoute)
            })
        })
    }

    //#endregion

}