import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ManifestVM } from '../../classes/view-models/manifest-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css']
})

export class ManifestListComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public feature = 'manifestList'
    public featureIcon = 'manifest'
    public icon = 'arrow_back'
    public parentUrl = '/manifest'

    public passengerCount = 0
    public record: ManifestVM
    public filteredRecord: ManifestVM

    public dropdownGenders = []
    public dropdownNationalities = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private emojiService: EmojiService, private helperService: HelperService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        if (this.record != null && this.record.passengers.length > 0) {
            this.calculateTableHeight()
            this.populateDropdownFilters()
        }
        // this.calculateTotals()
        // this.populateCriteriaFromStoredVariables()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        // TODO
    }

    public filterRecords(event: { filteredValue: ManifestVM }): void {
        this.filteredRecord = event.filteredValue

    }

    public formatDateToLocale(date: string): string {
        return this.dateHelperService.formatISODateToLocale(date, false)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    //#endregion

    //#region private methods

    private calculateTableHeight(): void {
        setTimeout(() => {
            document.getElementById('table-wrapper').style.height = this.helperService.calculateTableWrapperHeight('top-bar', 'header', 'footer')
        }, 500)
    }

    private calculateTotals(): void {
        this.passengerCount = this.record.passengers.length
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.record = listResolved.list
                this.filteredRecord = listResolved.list
                resolve(this.record)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private populateDropdownFilters(): void {
        if (this.record != null) {
            this.dropdownGenders = this.helperService.getDistinctRecords(this.record.passengers, 'gender')
            this.dropdownNationalities = this.helperService.getDistinctRecords(this.record.passengers, 'nationalityDescription')
        }
    }

    //#endregion

}