import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingCriteriaVM } from '../../classes/view-models/invoicing-criteria-vm'
import { InvoicingDisplayService } from '../../classes/services/invoicing-display.service'
import { InvoicingPrinterService } from '../../classes/services/invoicing-printer.service'
import { InvoicingVM } from '../../classes/view-models/invoicing-vm'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { InvoicingPrintCriteriaVM } from '../../classes/view-models/invoicing-print-criteria-vm'

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
    public feature = 'invoicingList'
    public icon = 'arrow_back'
    public parentUrl = '/invoicing'

    public invoicingCriteria: InvoicingCriteriaVM
    public records: InvoicingVM[] = []
    public filteredRecords: InvoicingVM[] = []
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private emojiService: EmojiService, private helperService: HelperService, private invoicingDisplayService: InvoicingDisplayService, private invoicingPrinterService: InvoicingPrinterService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService,) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.loadRecords()
        this.populateCriteriaFromStoredVariables()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public exportAllCustomers(): void {
        this.records.forEach((record: any) => {
            this.exportSingleCustomer(record.date, record.customer.id)
        })
    }

    public exportSingleCustomer(date: string, customerId: string): void {
        const jsonString = '{ "date": "2022-07-01", "customerId": "1" }'
        const criteria = JSON.parse(jsonString)
        this.invoicingPrinterService.createReport(criteria).subscribe((response) => {
            this.invoicingPrinterService.openReport(response.response + '.pdf').subscribe({
                next: (pdf) => {
                    const blob = new Blob([pdf], { type: 'application/pdf' })
                    const fileURL = URL.createObjectURL(blob)
                    window.open(fileURL, '_blank')
                },
                error: (errorFromInterceptor) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                }
            })
        })
    }

    public hasTransfer(value: any): boolean {
        return value ? true : false
    }

    public formatDate(): string {
        return this.formatDateToLocale(this.invoicingCriteria.date, true)
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

    public replaceWildcardWithText(criteria: any): string {
        if (criteria.description.includes(this.emojiService.getEmoji('wildcard'))) {
            return this.emojiService.getEmoji('wildcard')
        } else {
            return criteria.description
        }
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

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private formatDateToLocale(date: string, showWeekday = false): string {
        return this.helperService.formatISODateToLocale(date, showWeekday)
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = listResolved.result
            console.log(this.records)
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            this.invoicingCriteria = {
                date: criteria.date,
                customer: criteria.customer,
                destination: criteria.destination,
                ship: criteria.ship
            }
        }
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
