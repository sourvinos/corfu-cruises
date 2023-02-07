import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { CoachRouteListVM } from '../../classes/view-models/coachRoute-list-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'

@Component({
    selector: 'route-list',
    templateUrl: './coachRoute-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css']
})

export class CoachRouteListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    private url = 'coachRoutes'
    public feature = 'coachRouteList'
    public featureIcon = 'coachRoutes'
    public icon = 'home'
    public parentUrl = '/'
    public records: CoachRouteListVM[] = []
    public recordsFilteredCount: number

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords().then(() => {
            this.scrollToSavedRow().then(() => {
                this.highlightRowFromStorage()
            })
        })
    }

    ngAfterViewInit(): void {
        this.filterTableFromStoredFilters()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public editRecord(id: number): void {
        this.storeScrollTop()
        this.storeSelectedId(id)
        this.router.navigate([this.url, id])
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
        this.recordsFilteredCount = event.filteredValue.length
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['abbreviation', 'description'])
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
                this.filterColumn(filters.hasTransfer, 'hasTransfer', 'equals')
                this.filterColumn(filters.abbreviation, 'abbreviation', 'contains')
                this.filterColumn(filters.description, 'description', 'contains')
            }, 500)
        }
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private highlightRowFromStorage(): void {
        setTimeout(() => {
            document.getElementById(this.localStorageService.getItem('id'))?.classList.add('p-highlight')
        }, 1000)
    }

    private loadRecords(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error == null) {
                this.records = Object.assign([], listResolved.list)
                this.recordsFilteredCount = this.records.length
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
    }

    private scrollToSavedRow(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                document.getElementsByClassName('p-scroller-inline')[0]?.scrollTo({
                    top: parseInt(this.localStorageService.getItem('scrollTop')) || 0,
                    left: 0,
                    behavior: 'auto'
                })
                resolve(null)
            }, 0)
        })
    }

    private storeScrollTop(): void {
        this.helperService.storeScrollTop('p-scroller-inline')
    }

    private storeSelectedId(id: number): void {
        this.localStorageService.saveItem('id', id.toString())
    }

    //#endregion

}
