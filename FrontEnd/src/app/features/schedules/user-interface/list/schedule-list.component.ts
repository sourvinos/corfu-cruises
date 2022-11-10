import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
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

    private unsubscribe = new Subject<void>()
    private url = 'schedules'
    public feature = 'scheduleList'
    public featureIcon = 'schedules'
    public icon = 'home'
    public parentUrl = '/'
    public records: ScheduleListVM[] = []
    public recordsFiltered: ScheduleListVM[] = []

    public dropdownDates = []
    public dropdownDestinations = []
    public dropdownPorts = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.formatTableDateColumnToLocale()
        this.calculateTableHeight()
        this.populateDropdownFilters()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.recordsFiltered = event.filteredValue
    }

    public formatDateToLocale(date: string): string {
        return this.dateHelperService.formatISODateToLocale(date)
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

    private formatTableDateColumnToLocale(): void {
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
        this.dropdownDates = this.helperService.getDistinctRecords(this.records, 'formattedDate')
        this.dropdownDestinations = this.helperService.getDistinctRecords(this.records, 'destinationDescription')
        this.dropdownPorts = this.helperService.getDistinctRecords(this.records, 'portDescription')
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.formatTableDateColumnToLocale()
        })
    }

    //#endregion

}
