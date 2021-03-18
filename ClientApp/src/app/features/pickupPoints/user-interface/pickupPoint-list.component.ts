import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RouteService } from 'src/app/features/routes/classes/route.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { PickupPoint } from '../classes/pickupPoint'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './pickupPoint-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointListComponent {

    //#region variables

    private baseUrl = this.location.path()
    private localStorageSearchTerm = 'searchTermPickupPoint'
    private ngUnsubscribe = new Subject<void>()
    private records: PickupPoint[] = []
    private resolver = 'pickupPointList'
    private unlisten: Unlisten
    private windowTitle = 'Pickup points'
    public feature = 'pickupPointList'
    public filteredRecords: PickupPoint[] = []
    public highlightFirstRow = false
    public newUrl = this.baseUrl + '/pickupPoint/new'
    public searchTerm = ''
    public sortColumn: string
    public sortOrder: string

    //#endregion

    //#region particular variables

    public routeAbbreviation: string

    //#endregion

    //#region table

    headers = ['', 'Id', 'headerDescription', 'headerExactPoint', 'headerTime', 'headerCoordinates', '']
    widths = ['40px', '0', '45%', '', '100px', '20%', '56px']
    visibility = ['none', 'none']
    justify = ['center', 'center', 'left', 'left', 'center', 'left', 'center']
    types = ['', '', '', '', '', '', '']
    fields = ['', 'id', 'description', 'exactPoint', 'time', 'coordinates', '']

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private routeService: RouteService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(p => {
            this.getRouteDescription(p.routeId)
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.getFilterFromStorage()
        if (!this.getSortObjectFromStorage()) this.saveSortObjectToStorage('description', 'asc')
        this.loadRecords()
        this.addShortcuts()
        this.subscribeToInteractionService()
        this.onFilter(this.searchTerm)
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
            'Alt.F': (event: KeyboardEvent) => {
                this.focus(event, 'searchTerm')
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
        this.router.navigate(['pickupPoint/', id], { relativeTo: this.activatedRoute })
    }

    private focus(event: KeyboardEvent, element: string): void {
        event.preventDefault()
        this.helperService.setFocus(element)
    }

    private getFilterFromStorage(): void {
        this.searchTerm = this.helperService.readItem(this.localStorageSearchTerm)
    }

    private getRouteDescription(routeId: number): void {
        this.routeService.getSingle(routeId).subscribe(result => {
            this.routeAbbreviation = result.abbreviation
        })
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
        this.router.navigate(['../../'])
    }

    private loadRecords(): void {
        const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.list
            this.filteredRecords = this.records.sort((a, b) => (a.description > b.description) ? 1 : -1)
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
