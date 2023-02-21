import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
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
    public recordsFilteredCount: number
    public isVirtual = true
    private scrollableElement: any

    public dropdownRoutes = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private pickupPointPdfService: PickupPointPdfService, private router: Router) {
        this.loadRecords().then(() => {
            this.populateDropdownFilters()
            this.filterTableFromStoredFilters()
            this.enableDisableFilters()
        })
    }

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getScrollableElement()
            this.toggleVirtual()
            this.hightlightSavedRow()
        }, 500)
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
        this.storeScrollTop()
        this.storeSelectedId(id)
        this.navigateToForm(id)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
        this.recordsFiltered = event.filteredValue
        this.recordsFilteredCount = event.filteredValue.length
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
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

    public unHighlightAllRows(): void {
        this.helperService.unHighlightAllRows()
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private enableDisableFilters(): void {
        if (this.records.length == 0) {
            this.helperService.disableTableFilters()
        }
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
                this.filterColumn(filters.coachRoute, 'coachRoute', 'in')
                this.filterColumn(filters.description, 'description', 'contains')
                this.filterColumn(filters.exactPoint, 'exactPoint', 'contains')
                this.filterColumn(filters.time, 'time', 'contains')
            }, 500)
        }
    }

    private getScrollableElement(): void {
        this.scrollableElement = document.getElementsByClassName('p-datatable-wrapper')[0]
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private hightlightSavedRow(): void {
        setTimeout(() => {
            this.scrollableElement.scrollTop = parseInt(this.localStorageService.getItem('scrollTop')) | 0
            document.getElementById(this.localStorageService.getItem('id'))?.classList.add('p-highlight')
        }, 1000)
    }

    private loadRecords(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                this.recordsFilteredCount = this.records.length
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
    }

    private navigateToForm(id: number): void {
        this.router.navigate([this.url, id])
    }

    private populateDropdownFilters(): void {
        this.dropdownRoutes = this.helperService.getDistinctRecords(this.records, 'coachRoute', 'description')
    }

    private storeScrollTop(): void {
        this.localStorageService.saveItem('scrollTop', this.scrollableElement.scrollTop)
    }

    private storeSelectedId(id: number): void {
        this.localStorageService.saveItem('id', id.toString())
    }

    private toggleVirtual(): void {
        this.isVirtual = !this.isVirtual
    }

    //#endregion

}
