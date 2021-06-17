import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { Table } from 'primeng/table'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Customer } from '../classes/customer'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ListResolved } from '../../../shared/classes/list-resolved'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from '../../../shared/services/snackbar.service'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', '../../../../assets/styles/prime-table.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CustomerListComponent {

    //#region variables

    private baseUrl = '/customers'
    private localStorageSearchTerm = 'customer-list-search-term'
    private ngUnsubscribe = new Subject<void>()
    private records: Customer[] = []
    private resolver = 'customerList'
    private unlisten: Unlisten
    private windowTitle = 'Customers'
    public feature = 'customerList'
    public filteredRecords: Customer[] = []
    public newUrl = this.baseUrl + '/new'
    public searchTerm = ''
    public selectedRecord: Customer

    //#endregion

    //#region table

    @ViewChild('table') table: Table | undefined

    columns = [
        { field: 'id', header: 'Id', width: '0%' },
        { field: 'description', header: 'headerName', width: '40%' },
        { field: 'phones', header: 'headerPhones', width: '30%' },
        { field: 'email', header: 'headerEmail', width: '30%' }
    ];

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.getFilterFromStorage()
        this.loadRecords()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onApplyFilter($event: any, stringVal: any): void {
        this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal)
        this.updateStorageWithFilter()
    }

    public onEditRecord(record: Customer): void {
        this.router.navigate([this.baseUrl, record.id])
    }

    public onExportXLS(): void {
        console.log()
    }

    public onExportPDF(): void {
        console.log()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.S': () => {
                this.focus('searchTerm')
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private focus(element: string): void {
        this.helperService.setFocus(element)
    }

    private getFilterFromStorage(): void {
        this.searchTerm = this.helperService.readItem(this.localStorageSearchTerm)
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords(): void {
        const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.list
            this.filteredRecords = this.records
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updateStorageWithFilter(): void {
        this.helperService.saveItem(this.localStorageSearchTerm, this.searchTerm)
    }

    //#endregion

}
