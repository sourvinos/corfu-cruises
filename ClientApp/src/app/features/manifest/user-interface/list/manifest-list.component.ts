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
import { ShipRouteService } from 'src/app/features/ships/routes/classes/services/shipRoute.service'
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
    public crewCount = 0
    public feature = 'manifestList'
    public filteredRecords: ManifestViewModel
    public passengerCount = 0
    public records: ManifestViewModel
    public selectedShipRoute: any

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
        this.pdfService.createReport(this.records)
    }

    public onFilterExclude(occupantDescription?: string): void {
        this.filteredRecords.passengers = occupantDescription ? this.records.passengers.filter(x => x.occupantDescription != occupantDescription) : this.records.passengers
    }

    public onFormatDate(date: string): string {
        return this.helperService.formatDateToLocale(date)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
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

    private goBack(): void {
        this.router.navigate(['/manifest'])
    }

    private loadRecords(): void {
        // this.manifestService.get('2021-05-01', 1, 2, 2).subscribe(result => {
        //     console.log('Result', result)
        //     this.records = result
        //     this.filteredRecords = Object.assign([], this.records)
        //     console.log('Records', this.filteredRecords)
        // })
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
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