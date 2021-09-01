import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingPdfService } from '../../classes/services/invoicing-pdf.service'
import { InvoicingService } from '../../classes/services/invoicing.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'invoicing-list',
    templateUrl: './invoicing-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './invoicing-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class InvoicingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'invoicingList'
    private unlisten: Unlisten
    private windowTitle = 'Invoicing'
    public feature = 'invoicingList'
    public records: any

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private invoicingService: InvoicingService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private invoicingPdfService: InvoicingPdfService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
                this.showCriteria()
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

    public onPdfTask(date: string, customerId): void {
        this.invoicingService.get(date, customerId, 0, 0).subscribe(result => {
            this.invoicingPdfService.doInvoiceTasks(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    public onPdfTasks(): void {
        this.records.forEach((record: any) => {
            this.onPdfTask(record.date, record.customerResource.id)
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/invoicing'])
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
            this.records = listResolved.result
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private showCriteria(): void {
        if (this.helperService.readItem('invoicingCriteria')) {
            const criteria = JSON.parse(this.helperService.readItem('invoicingCriteria'))
            console.log(criteria)
            // this.form.setValue({
            //     date: moment(criteria.date).toISOString()
            // })
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
