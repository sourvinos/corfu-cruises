import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
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
import { PickupPoint } from '../classes/pickupPoint'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private baseUrl = this.location.path()
    private ngUnsubscribe = new Subject<void>()
    private resolver = 'pickupPointList'
    private unlisten: Unlisten
    private windowTitle = 'Pickup points'
    public feature = 'pickupPointList'
    public newUrl = this.baseUrl + '/new'
    public records: any[] = []

    public routes = []
    public rowGroupMetadata: any

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.loadRecords()
        this.getDistinctRoutes()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onEditRecord(record: PickupPoint): void {
        this.router.navigate([this.baseUrl, record.id])
    }

    public onFilter(event: { filteredValue: string | any[] }): void {
        this.updateRowGroupMetaData(event.filteredValue)
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
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private getDistinctRoutes(): void {
        let array = []
        array = [... new Set(this.records.map(x => x.routeAbbreviation))]
        array.forEach(element => {
            this.routes.push({ label: element, value: element })
        })
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords(): void {
        const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.list
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

    private updateRowGroupMetaData(data: string | any[]): void {

        this.rowGroupMetadata = {}

        if (data) {
            for (let i = 0; i < data.length; i++) {
                const rowData = data[i]
                const routeAbbreviation = rowData.routeAbbreviation
                if (i == 0) {
                    this.rowGroupMetadata[routeAbbreviation] = { index: 0, size: 1 }
                }
                else {
                    const previousRowData = data[i - 1]
                    const previousRowGroup = previousRowData.routeAbbreviation
                    if (routeAbbreviation === previousRowGroup)
                        this.rowGroupMetadata[routeAbbreviation].size++
                    else
                        this.rowGroupMetadata[routeAbbreviation] = { index: i, size: 1 }
                }
            }
        }

    }

    //#endregion

}
