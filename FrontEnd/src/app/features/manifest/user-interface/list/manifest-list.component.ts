import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { ManifestCriteriaVM } from '../../classes/view-models/criteria/manifest-criteria-vm'
import { ManifestGenderVM } from '../../classes/view-models/list/manifest-gender-vm'
import { ManifestNationalityVM } from '../../classes/view-models/list/manifest-nationality-vm'
import { ManifestOccupantVM } from '../../classes/view-models/list/manifest-occupant-vm'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestVM } from '../../classes/view-models/list/manifest-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css']
})

export class ManifestListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    public feature = 'manifestList'
    public featureIcon = 'manifest'
    public icon = 'arrow_back'
    public parentUrl = '/manifest'

    public criteriaPanels: ManifestCriteriaVM
    public records: ManifestVM
    public totals: number[] = [0, 0, 0, 0]

    public dropdownGenders: ManifestGenderVM[]
    public dropdownNationalities: ManifestNationalityVM[]
    public dropdownOccupants: ManifestOccupantVM[]

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private helperService: HelperService, private localStorageService: LocalStorageService, private manifestPdfService: ManifestPdfService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.addCrewToPassengers()
        this.populateDropdownFilters()
        this.populateCriteriaPanelsFromStorage()
        this.updateTotals()
    }

    ngAfterViewInit(): void {
        this.enableDisableFilters()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        this.manifestPdfService.createReport(this.records)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.totals[3] = event.filteredValue.reduce((sum: number) => sum + 1, 0)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['lastname', 'firstname'])
    }

    //#endregion

    //#region private methods

    private addCrewToPassengers(): void {
        if (this.records.passengers.length > 0) {
            this.records.ship.crew.forEach(crew => {
                this.records.passengers.push(crew)
            })
        }
    }

    private enableDisableFilters(): void {
        if (this.records.passengers.length == 0) {
            this.helperService.disableTableDropdownFilters()
            this.helperService.disableTableTextFilters()
        }
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.localStorageService.getItem('manifest-criteria-panel')) {
            this.criteriaPanels = JSON.parse(this.localStorageService.getItem('manifest-criteria-panel'))
        }
    }

    private populateDropdownFilters(): void {
        if (this.records.passengers.length > 0) {
            this.dropdownGenders = this.helperService.getDistinctRecords(this.records.passengers, 'gender')
            this.dropdownNationalities = this.helperService.getDistinctRecords(this.records.passengers, 'nationality')
            this.dropdownOccupants = this.helperService.getDistinctRecords(this.records.passengers, 'occupant')
        }
    }

    private updateTotals(): void {
        this.totals[0] = this.records.passengers.length
        this.totals[1] = this.records.passengers.filter(x => x.occupant.description == 'PASSENGER').length
        this.totals[2] = this.records.passengers.filter(x => x.occupant.description == 'CREW').length
        this.totals[3] = this.records.passengers.reduce((sum: number) => sum + 1, 0)
    }

    //#endregion

}