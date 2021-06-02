import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ShipOwner } from './../classes/ship-owner'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'

@Component({
    selector: 'shipOwner-list',
    templateUrl: './shipOwner-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ShipOwnerListComponent {

    //#region variables

    private baseUrl = '/shipOwners'
    private localStorageSearchTerm = 'searchTermShipOwner'
    private ngUnsubscribe = new Subject<void>()
    private records: ShipOwner[] = []
    private resolver = 'shipOwnerList'
    private unlisten: Unlisten
    private windowTitle = 'Ship owners'
    public feature = 'shipOwnerList'
    public filteredRecords: ShipOwner[] = []
    public highlightFirstRow = false
    public newUrl = this.baseUrl + '/new'
    public searchTerm = ''
    public sortColumn: string
    public sortOrder: string

    //#endregion

    //#region table

    headers = ['', 'Id', 'headerName', '']
    widths = ['40px', '0px', '', '56px']
    visibility = ['none', 'none', '', '']
    justify = ['center', 'center', 'left', 'center']
    types = ['', '', '', '']
    fields = ['', 'id', 'description', '']

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.getFilterFromStorage()
        if (!this.getSortObjectFromStorage()) this.saveSortObjectToStorage('description', 'asc')
        this.loadRecords()
        this.addShortcuts()
        this.subscribeToInteractionService()
        this.onFilter(this.searchTerm)
        this.focus('searchTerm')
    }

    ngOnDestroy(): void {
        this.updateStorageWithFilter()
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onFilter(query: string): void {
        this.searchTerm = query
        this.filteredRecords = query ? this.records.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'goBack')
            },
            'Alt.F': () => {
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

    private editRecord(id: number): void {
        this.router.navigate([this.baseUrl, id])
    }

    private focus(element: string): void {
        event.preventDefault()
        this.helperService.setFocus(element)
    }

    private getFilterFromStorage(): void {
        this.searchTerm = this.helperService.readItem(this.localStorageSearchTerm)
    }

    private getSortObjectFromStorage(): boolean {
        try {
            const sortObject = JSON.parse(this.helperService.readItem(this.feature))
            if (sortObject) {
                this.sortColumn = sortObject.column
                this.sortOrder = sortObject.order
                return true
            }
        } catch {
            return false
        }
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

    private saveSortObjectToStorage(columnName: string, sortOrder: string): void {
        this.helperService.saveItem(this.feature, JSON.stringify({ columnName, sortOrder }))
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.updateStorageWithFilter()
            this.editRecord(response['id'])
        })
    }

    private updateStorageWithFilter(): void {
        this.helperService.saveItem(this.localStorageSearchTerm, this.searchTerm)
    }

    //#endregion

}
