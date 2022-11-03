import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointListVM } from '../classes/view-models/pickupPoint-list-vm'
import { PickupPointPdfService } from '../classes/services/pickupPoint-pdf.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './pickupPoint-list.component.css']
})

export class PickupPointListComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    private url = 'pickupPoints'
    public feature = 'pickupPointList'
    public featureIcon = 'pickupPoints'
    public icon = 'home'
    public parentUrl = '/'
    public records: PickupPointListVM[] = []
    public recordsFiltered: PickupPointListVM[] = []

    public dropdownRoutes = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private helperService: HelperService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private pickupPointPdfService: PickupPointPdfService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.calculateTableHeight()
        this.populateDropdownFilters()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
    }

    public exportRecords(): void {
        this.pickupPointPdfService.createReport(this.recordsFiltered)
    }

    public filterRecords(event: { filteredValue: any[] }) {
        this.recordsFiltered = event.filteredValue
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    //#endregion

    //#region private methods

    private calculateTableHeight(): void {
        setTimeout(() => {
            document.getElementById('table-wrapper').style.height = this.helperService.calculateTableWrapperHeight('top-bar', 'header', 'footer')
        }, 500)
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                this.recordsFiltered = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private populateDropdownFilters() {
        this.dropdownRoutes = this.helperService.getDistinctRecords(this.records, 'coachRouteAbbreviation')
    }

    //#endregion

}
