import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { Subject, takeUntil } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ShipActiveVM } from '../../ships/classes/view-models/ship-active-vm'
import { ShipCrewListVM } from '../classes/view-models/shipCrew-list-vm'

@Component({
    selector: 'ship-crew-list',
    templateUrl: './shipCrew-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css']
})

export class ShipCrewListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    private url = 'shipCrews'
    public feature = 'shipCrewList'
    public featureIcon = 'shipCrews'
    public icon = 'home'
    public parentUrl = '/'
    public records: ShipCrewListVM[] = []
    public recordsFilteredCount: number
    public isVirtual = true
    private scrollableElement: any

    public filterDate = ''
    public distinctShips: ShipActiveVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private emojiService: EmojiService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) {
        this.loadRecords().then(() => {
            this.populateDropdownFilters()
            this.filterTableFromStoredFilters()
            this.formatDatesToLocale()
            this.enableDisableFilters()
            this.subscribeToInteractionService()
            this.setLocale()
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

    public clearDateFilter(): void {
        this.table.filter('', 'birthdate', 'equals')
        this.filterDate = ''
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public editRecord(id: number): void {
        this.storeScrollTop()
        this.storeSelectedId(id)
        this.router.navigate([this.url, id])
    }

    public filterByDate(event: MatDatepickerInputEvent<Date>): void {
        const date = this.dateHelperService.formatDateToIso(new Date(event.value), false)
        this.table.filter(date, 'birthdate', 'equals')
        this.filterDate = date
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
        this.recordsFilteredCount = event.filteredValue.length
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public hasDateFilter(): string {
        return this.filterDate == '' ? 'hidden' : ''
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    public resetTableFilters(): void {
        this.filterDate = ''
        this.helperService.clearTableTextFilters(this.table, ['lastname', 'firstname', 'birthdate'])
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
            this.helperService.disableTableDropdownFilters()
            this.helperService.disableTableTextFilters()
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
                this.filterColumn(filters.lastname, 'lastname', 'contains')
                this.filterColumn(filters.firstname, 'firstname', 'contains')
                this.filterColumn(filters.birthdate, 'birthdate', 'equals')
                if (filters.birthdate != undefined) {
                    const date = new Date(Date.parse(filters.birthdate.value))
                    this.filterDate = this.dateAdapter.createDate(date.getFullYear(), date.getMonth(), parseInt(date.getDate().toLocaleString()))
                }
            }, 500)
        }
    }

    private formatDatesToLocale(): void {
        this.records.forEach(record => {
            record.formattedBirthdate = this.dateHelperService.formatISODateToLocale(record.birthdate)
        })
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

    private populateDropdownFilters(): void {
        this.distinctShips = this.helperService.getDistinctRecords(this.records, 'ship', 'description')
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeSelectedId(id: number): void {
        this.localStorageService.saveItem('id', id.toString())
    }

    private storeScrollTop(): void {
        this.helperService.storeScrollTop('p-scroller-inline')
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.formatDatesToLocale()
            this.setLocale()
        })
    }

    private toggleVirtual(): void {
        this.isVirtual = !this.isVirtual
    }

    //#endregion

}
