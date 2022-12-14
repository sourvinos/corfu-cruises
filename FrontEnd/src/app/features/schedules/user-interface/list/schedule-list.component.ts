import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { Subject, takeUntil } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ScheduleListVM } from './../../classes/view-models/schedule-list-vm'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css']
})

export class ScheduleListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    private url = 'schedules'
    public feature = 'scheduleList'
    public featureIcon = 'schedules'
    public icon = 'home'
    public parentUrl = '/'
    public records: ScheduleListVM[] = []
    public recordsFiltered: ScheduleListVM[] = []

    public dropdownDate = ''
    public dropdownDestinations = []
    public dropdownPorts = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.formatDateToLocale()
        this.populateDropdownFilters()
        this.subscribeToInteractionService()
        this.setLocale()
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
        this.router.navigate([this.url, id])
    }

    public filterByDate(event: MatDatepickerInputEvent<Date>): void {
        const date = this.dateHelperService.formatDateToIso(event.value, false)
        this.table.filter(date, 'date', 'equals')
        this.dropdownDate = date
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.recordsFiltered = event.filteredValue
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public hasDateFilter(): string {
        return this.dropdownDate == '' ? 'hidden' : ''
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    public clearDateFilter(): void {
        this.table.filter('', 'date', 'equals')
        this.dropdownDate = ''
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public resetTableFilters(): void {
        this.dropdownDate = ''
        this.helperService.clearTableTextFilters(this.table, ['date', 'maxPax'])
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterColumns(element: { value: any }, field: string, matchMode: string): void {
        if (element != undefined && (element.value != null || element.value != undefined)) {
            this.table.filter(element.value, field, matchMode)
        }
    }

    private filterTableFromStoredFilters(): void {
        const filters = this.localStorageService.getFilters(this.feature)
        if (filters != undefined) {
            setTimeout(() => {
                this.filterColumns(filters.isActive, 'isActive', 'contains')
                this.filterColumns(filters.date, 'date', 'equals')
                this.filterColumns(filters.destinationDescription, 'destinationDescription', 'equals')
                this.filterColumns(filters.portDescription, 'portDescription', 'equals')
                this.filterColumns(filters.maxPax, 'maxPax', 'contains')
                if (filters.date != undefined) {
                    const date = new Date(Date.parse(filters.date.value))
                    this.dropdownDate = this.dateAdapter.createDate(date.getFullYear(), date.getMonth(), parseInt(date.getDate().toLocaleString()))
                }
            }, 500)
        }
    }

    private formatDateToLocale(): void {
        this.records.forEach(record => {
            record.formattedDate = this.dateHelperService.formatISODateToLocale(record.date)
        })
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
        this.dropdownDestinations = this.helperService.getDistinctRecords(this.records, 'destinationDescription')
        this.dropdownPorts = this.helperService.getDistinctRecords(this.records, 'portDescription')
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.formatDateToLocale()
            this.setLocale()
        })
    }

    //#endregion

}
