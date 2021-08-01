import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
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
import { ShipListResource } from '../classes/ship-list-resource'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'ship-list',
    templateUrl: './ship-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ShipListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private baseUrl = '/ships'
    private localStorageSearchTerm = 'ship-list-search-term'
    private ngUnsubscribe = new Subject<void>()
    private records: ShipListResource[] = []
    private resolver = 'shipList'
    private unlisten: Unlisten
    private windowTitle = 'Ships'
    public feature = 'shipList'
    public filteredRecords: ShipListResource[] = []
    public newUrl = this.baseUrl + '/new'
    public searchTerm = ''

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

    public onEditRecord(id: number): void {
        this.router.navigate([this.baseUrl, id])
    }

    public onFilter($event: any, stringVal: any): void {
        this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal)
        this.updateStorageWithFilter()
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
        event.preventDefault()
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
            console.log('list', this.records)
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
