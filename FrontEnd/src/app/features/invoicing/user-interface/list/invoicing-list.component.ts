import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingPdfService } from '../../classes/services/invoicing-pdf.service'
import { InvoicingService } from '../../classes/services/invoicing.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { InvoicingVM } from '../../classes/view-models/invoicing-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'

@Component({
    selector: 'invoicing-list',
    templateUrl: './invoicing-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './invoicing-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class InvoicingListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    private url = 'invoicing'
    public feature = 'invoicingList'
    public icon = 'arrow_back'
    public parentUrl = '/invoicing'

    public record: any

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private helperService: HelperService,
        private invoicingService: InvoicingService,
        private keyboardShortcutsService: KeyboardShortcuts,
        private localStorageService: LocalStorageService,
        private messageLabelService: MessageLabelService,
        private emojiService: EmojiService,
        private messageSnackbarService: MessageSnackbarService,
        private invoicingPdfService: InvoicingPdfService,
        private router: Router,
        private snackbarService: SnackbarService,
        private titleService: Title
    ) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public exportAllCustomers(): void {
        this.record.forEach((record: any) => {
            this.exportSingleCustomer(record.date, record.customer.id)
        })
    }

    public exportSingleCustomer(date: string, customerId: string): void {
        this.invoicingService.get(date, customerId, 'all', 'all').subscribe(result => {
            this.invoicingPdfService.doInvoiceTasks(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.record = listResolved.result
            console.log('1', this.record.reservations)
            // console.log('2', this.records.reservations)
            // console.log('3', this.records[0].reservations)
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
