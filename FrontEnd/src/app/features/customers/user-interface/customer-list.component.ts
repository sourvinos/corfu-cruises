import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { CustomerListVM } from '../classes/view-models/customer-list-vm'
import { ListResolved } from '../../../shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css']
})

export class CustomerListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    private url = 'customers'
    public feature = 'customerList'
    public featureIcon = 'customers'
    public icon = 'home'
    public parentUrl = '/'
    public records: CustomerListVM[] = []
    public recordsFiltered: CustomerListVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
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
        this.table.filter('', 'description', 'contains')
        this.table.filter('', 'email', 'contains')
        this.table.filter('', 'phones', 'contains')
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
                this.filterColumns(filters.isActive, 'isActive', 'equals')
                this.filterColumns(filters.description, 'description', 'contains')
                this.filterColumns(filters.email, 'email', 'contains')
                this.filterColumns(filters.phones, 'phones', 'contains')
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

    //#endregion

}
