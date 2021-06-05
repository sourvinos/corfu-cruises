import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestViewModel } from '../../classes/view-models/manifest-view-model'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { ShipRoute } from 'src/app/features/ships/routes/classes/shipRoute'
import { ShipRouteService } from 'src/app/features/ships/routes/classes/shipRoute.service'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'manifestList'
    private windowTitle = 'Manifest'
    public feature = 'manifestList'

    //#endregion

    //#region particular variables

    public records: ManifestViewModel
    public shipRoutes: ShipRoute[] = []
    public selectedShipRoute: any
    public highlightFirstRow = false

    //#endregion

    //#region table

    headers = ['', 'headerId', 'headerLastname', 'headerFirstname', 'headerNationality', 'headerDoB', 'headerOccupant', 'headerGender', 'headerRemarks', 'headerSpecialCare', '']
    widths = ['0px', '0px', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '56px']
    visibility = ['none', 'none', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'left', 'left', 'left', 'left', 'center', 'center', 'left', 'left', 'left', 'left']
    types = ['', '', '', '', '', '', '', '', '', '', '']
    fields = ['', 'reservationId', 'lastname', 'firstname', 'nationalityDescription', 'birthDate', 'occupantDescription', 'genderDescription', 'remarks', 'specialCare', '']

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: ManifestPdfService, private router: Router, private snackbarService: SnackbarService, private shipRouteService: ShipRouteService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.getLocale()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public onCreatePdf(): void {
        this.updateShipRoute().then(() => {
            this.pdfService.createReport(this.selectedShipRoute, this.records)
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/manifest'])
    }

    //#endregion

    //#region private methods

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
        } else {
            this.onGoBack()
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