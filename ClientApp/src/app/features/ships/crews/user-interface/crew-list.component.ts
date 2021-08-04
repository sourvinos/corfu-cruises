import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { CrewListResource } from './../classes/crew-list-resource'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { CrewService } from '../classes/crew.service'

@Component({
    selector: 'crew-list',
    templateUrl: './crew-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CrewListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private baseUrl = '/shipCrews'
    private localStorageSearchTerm = 'crew-list-search-term'
    private ngUnsubscribe = new Subject<void>()
    private resolver = 'crewList'
    private unlisten: Unlisten
    private windowTitle = 'Crews'
    public feature = 'crewList'
    public newUrl = this.baseUrl + '/new'
    public records: CrewListResource[] = []
    public searchTerm = ''

    private temp = []
    public rowGroupMetadata: any
    public ships = []

    //#endregion

    constructor(private crewService: CrewService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
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

    public onEditRecord(id: number): void {
        this.router.navigate([this.baseUrl, id])
    }

    public onFilter($event: any, stringVal: any): void {
        this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal)
        this.updateStorageWithFilter()
    }

    public onFormatDate(date: string): string {
        return this.helperService.formatDateToLocale(date)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSort(): void {
        this.updateRowGroupMetaData()
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

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords(): void {
        this.crewService.getAll().subscribe(result => {
            this.records = result
            console.log(this.records)
        })
        // const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.resolver]
        // if (listResolved.error === null) {
        //     this.records = listResolved.list
        //     console.log(this.records)

        // } else {
        //     this.goBack()
        //     this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        // }
    }

    private updateRowGroupMetaData(): void {

        console.log('Active', this.records)

        this.rowGroupMetadata = {}

        if (this.records) {
            for (let i = 0; i < this.records.length; i++) {
                const rowData = this.records[i]
                const shipDescription = rowData.shipDescription
                if (i == 0) {
                    this.rowGroupMetadata[shipDescription] = { index: 0, size: 1 }
                }
                else {
                    const previousRowData = this.records[i - 1]
                    const previousRowGroup = previousRowData.shipDescription
                    if (shipDescription === previousRowGroup)
                        this.rowGroupMetadata[shipDescription].size++
                    else
                        this.rowGroupMetadata[shipDescription] = { index: i, size: 1 }
                }
            }
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
