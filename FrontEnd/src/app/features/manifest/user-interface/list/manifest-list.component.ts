import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { ManifestCriteriaVM } from '../../classes/view-models/criteria/manifest-criteria-vm'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestRouteSelectorComponent } from './manifest-route-selector.component'
import { ManifestVM } from '../../classes/view-models/list/manifest-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css', '../../../../../assets/styles/criteria-panel.css']
})

export class ManifestListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    public feature = 'manifestList'
    public featureIcon = 'manifest'
    public icon = 'arrow_back'
    public parentUrl = '/manifest'
    public isVirtual = true

    public criteriaPanels: ManifestCriteriaVM

    public records: ManifestVM
    public totals = [0, 0, 0]
    public totalsFiltered = [0, 0, 0]

    public distinctGenders: SimpleEntity[]
    public distinctNationalities: SimpleEntity[]
    public distinctOccupants: SimpleEntity[]

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private helperService: HelperService, private localStorageService: LocalStorageService, private manifestPdfService: ManifestPdfService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords().then(() => {
            this.addCrewToPassengers().then(() => {
                this.populateDropdownFilters()
                this.enableDisableFilters()
                this.updateTotals(this.totals, this.records.passengers)
                this.updateTotals(this.totalsFiltered, this.records.passengers)
            })
        })
        this.populateCriteriaPanelsFromStorage()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public filterRecords(event: { filteredValue: any[] }): void {
        this.disableVirtualTable()
        this.updateTotals(this.totalsFiltered, event.filteredValue)
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

    public showRouteSelectorDialog(): void {
        const response = this.dialog.open(ManifestRouteSelectorComponent, {
            data: this.records,
            disableClose: false,
            height: '500px',
            panelClass: 'dialog',
            width: '800px',
        })
        response.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.records.shipRoute = result
                this.manifestPdfService.createReport(this.records)
            }
        })
    }

    //#endregion

    //#region private methods

    private addCrewToPassengers(): Promise<any> {
        const promise = new Promise((resolve) => {
            if (this.records.passengers.length > 0) {
                this.records.ship.crew.forEach(crew => {
                    this.records.passengers.push(crew)
                    resolve(this.records)
                })
            }
        })
        return promise
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private disableVirtualTable(): void {
        this.isVirtual = this.helperService.disableVirtualTable()
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
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
        return promise
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            this.criteriaPanels = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        if (this.records.passengers.length > 0) {
            this.distinctGenders = this.helperService.getDistinctRecords(this.records.passengers, 'genderDescription')
            this.distinctNationalities = this.helperService.getDistinctRecords(this.records.passengers, 'nationalityDescription')
            this.distinctOccupants = this.helperService.getDistinctRecords(this.records.passengers, 'occupantDescription')
        }
    }

    private updateTotals(totals: number[], filteredVelue: any[]): void {
        totals[0] = filteredVelue.length
        totals[1] = filteredVelue.filter(x => x.occupantDescription == 'PASSENGER').length
        totals[2] = filteredVelue.filter(x => x.occupantDescription == 'CREW').length
    }

    //#endregion

}