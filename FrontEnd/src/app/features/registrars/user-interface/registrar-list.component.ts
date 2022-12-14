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
import { RegistrarListVM } from '../classes/view-models/registrar-list-vm'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'registrar-list',
    templateUrl: './registrar-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css']
})

export class RegistrarListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    private url = 'registrars'
    public feature = 'registrarList'
    public featureIcon = 'registrars'
    public icon = 'home'
    public parentUrl = '/'
    public records: RegistrarListVM[] = []
    public recordsFiltered: RegistrarListVM[] = []

    public dropdownShips = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

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

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
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

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    public resetTableFilters(table: any): void {
        this.clearTableFilters(table)
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private clearTableFilters(table: { clear: () => void }): void {
        table.clear()
        this.table.filter('', 'fullname', 'contains')
        const inputs = document.querySelectorAll<HTMLInputElement>('.p-inputtext[type="text"]')
        inputs.forEach(box => {
            box.value = ''
        })
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
                this.filterColumns(filters.isPrimary, 'isPrimary', 'equals')
                this.filterColumns(filters.shipDescription, 'shipDescription', 'equals')
                this.filterColumns(filters.fullname, 'fullname', 'contains')
            }, 500)
        }
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error == null) {
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
        this.dropdownShips = this.helperService.getDistinctRecords(this.records, 'shipDescription')
    }

    //#endregion

}
