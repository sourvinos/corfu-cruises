import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointPdfService } from '../classes/services/pickupPoint-pdf.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { PickupPointListVM } from '../classes/view-models/pickupPoint-list-vm'

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointListComponent {


    //#region variables

    private unlisten: Unlisten
    private url = 'pickupPoints'
    public feature = 'pickupPointList'
    public icon = 'home'
    public parentUrl = '/'
    public records: PickupPointListVM[]
    public selectedRecords: PickupPointListVM[]

    public dropdownRoutes = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private pickupPointPdfService: PickupPointPdfService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.populateDropdownFilters()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
    }

    public export(): void {
        this.pickupPointPdfService.createReport(this.selectedRecords)
    }

    public filterRecords(event: { filteredValue: any[] }) {
        this.selectedRecords = event.filteredValue
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
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

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                this.selectedRecords = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private populateDropdownFilters() {
        this.dropdownRoutes = this.helperService.getDistinctRecords(this.records, 'coachRouteAbbreviation')
    }

    //#endregion

}
