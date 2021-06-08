import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingPdfService } from '../../classes/services/invoicing-pdf.service'
import { InvoicingService } from '../../classes/services/invoicing.service'
import { InvoicingViewModel } from './../../classes/view-models/invoicing-view-model'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'invoicing-list',
    templateUrl: './invoicing-list.component.html',
    styleUrls: ['./invoicing-list.component.css', '../../../../shared/components/table/custom-table.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class InvoicingListComponent {

    //#region variables

    private date: string
    private ngUnsubscribe = new Subject<void>()
    private resolver = 'invoicingList'
    private unlisten: Unlisten
    private windowTitle = 'Invoicing'
    public feature = 'invoicingList'
    public highlightFirstRow = false
    public queryResult: InvoicingViewModel[]
    public sortColumn: string
    public sortOrder: string

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private buttonClickService: ButtonClickService,
        private helperService: HelperService,
        private invoicingService: InvoicingService,
        private keyboardShortcutsService: KeyboardShortcuts,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageSnackbarService,
        private invoicingPdfService:InvoicingPdfService,
        private router: Router,
        private snackbarService: SnackbarService,
        private titleService: Title
    ) {
        this.activatedRoute.params.subscribe((params: Params) => this.date = params['dateIn'])
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && this.date !== '' && this.router.url.split('/').length === 4) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public doPdfTasks(date: string, customerId: number): void {
        this.invoicingService.getByDateAndCustomer(date, customerId).subscribe(result => {
            this.invoicingPdfService.doInvoiceTasks(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.queryResult = listResolved.result
            console.log(this.queryResult)
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
