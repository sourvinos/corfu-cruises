import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointListVM } from '../classes/view-models/pickupPoint-list-vm'
import { PickupPointPdfService } from '../classes/services/pickupPoint-pdf.service'

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css']
})

export class PickupPointListComponent {

    //#region variables

    @ViewChild('table') table: Table

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

    constructor(private activatedRoute: ActivatedRoute, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private pickupPointPdfService: PickupPointPdfService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.populateDropdownFilters()
    }

    ngAfterViewInit(): void {
        this.filterTableFromStoredFilters()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        this.pickupPointPdfService.createReport(this.recordsFiltered)
    }

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
    }

    public filterRecords(event: { filteredValue: any }): void {
        this.recordsFiltered = event.filteredValue
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['description', 'exactPoint', 'time'])
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterColumn(element: { value: any }, field: string, matchMode: string): void {
        if (element != undefined && (element.value != null || element.value != undefined)) {
            this.table.filter(element.value, field, matchMode)
        }
    }

    private filterTableFromStoredFilters(): void {
        const filters = this.localStorageService.getFilters(this.feature)
        if (filters != undefined) {
            setTimeout(() => {
                this.filterColumn(filters.isActive, 'isActive', 'contains')
                this.filterColumn(filters.coachRouteAbbreviation, 'coachRouteAbbreviation', 'equals')
                this.filterColumn(filters.description, 'description', 'contains')
                this.filterColumn(filters.exactPoint, 'exactPoint', 'contains')
                this.filterColumn(filters.time, 'time', 'contains')
            }, 500)
        }
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

    private populateDropdownFilters(): void {
        this.dropdownRoutes = this.helperService.getDistinctRecords(this.records, 'coachRouteAbbreviation')
    }

    //#endregion

}
