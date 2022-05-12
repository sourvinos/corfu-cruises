import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmbarkationCriteriaVM } from '../../classes/view-models/embarkation-criteria-vm'
import { EmbarkationDisplayService } from '../../classes/services/embarkation-display.service'
import { EmbarkationPrinterService } from '../../classes/services/embarkation-printer.service'
import { EmbarkationVM } from '../../classes/view-models/embarkation-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'embarkation-list',
    templateUrl: './embarkation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EmbarkationListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    private url = 'embarkation'
    public feature = 'embarkationList'
    public icon = 'arrow_back'
    public parentUrl = '/embarkation'

    public embarkationCriteria: EmbarkationCriteriaVM
    public filteredRecords: EmbarkationVM
    public isLoading = new Subject<boolean>()
    public records: EmbarkationVM

    public customers = []
    public drivers = []
    public ships = []

    public scannerEnabled: boolean
    public searchTerm: string

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private embarkationDisplayService: EmbarkationDisplayService, private embarkationPrinterService: EmbarkationPrinterService, private emojiService: EmojiService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.updatePassengerStatusPills()
                this.populateCriteriaFromStoredVariables()
                this.getDistinctCustomers()
                this.getDistinctDrivers()
                this.getDistinctShips()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.getLocale()
        this.setWindowTitle()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public camerasFound(): void {
        console.log('Camera list')
    }

    public doPostScanTasks(event: string): void {
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
        this.filterByTicketNo(event)
    }

    public formatDate(): string {
        return this.formatDateToLocale(this.embarkationCriteria.date, true)
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

    public hasDevices(): void {
        console.log('Devices found')
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public doFilterTasks(elementId: string, variable?: string): void {
        this.filterByEmbarkationStatus(variable)
        this.setActiveClassOnSelectedPill(elementId)
    }

    public doReportTasks(): void {
        this.ships.forEach(ship => {
            this.embarkationDisplayService.getShipIdFromDesciption(ship.value).subscribe(shipId => {
                const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
                const criteriaObject = {
                    date: criteria.date,
                    destinationId: criteria.destination.id,
                    portId: criteria.port.id,
                    shipId: shipId
                }
                this.embarkationPrinterService.createReport(criteriaObject).pipe(indicate(this.isLoading)).subscribe((response) => {
                    this.embarkationPrinterService.openReport(response.response + '.pdf').subscribe({
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
            })
        })
    }

    public embarkSinglePassenger(id: number): void {
        this.embarkationDisplayService.embarkSinglePassenger(id).pipe(indicate(this.isLoading)).subscribe(() => {
            this.refreshList()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public embarkAllPassengers(id: number[]): void {
        this.embarkationDisplayService.embarkAllPassengers(id).pipe(indicate(this.isLoading)).subscribe(() => {
            this.refreshList()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public onHideScanner(): void {
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
    }

    public onShowScanner(): void {
        console.log('Showing scanner window')
        this.searchTerm = ''
        this.scannerEnabled = true
        setTimeout(() => {
            this.positionVideo()
        }, 1000)
    }

    public onShowRemarks(remarks: string): void {
        this.dialogService.open(this.getLabel('remarks'), 'warningColor', remarks, ['ok'])
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
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'showScanner')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterByEmbarkationStatus(variable?: string): void {
        this.filteredRecords.embarkation = variable ? this.records.embarkation.filter(x => x.isCheckedIn != variable) : this.records.embarkation
    }

    private filterByTicketNo(query: string): void {
        this.filteredRecords.embarkation = []
        this.records.embarkation.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.filteredRecords.embarkation.push(record)
            }
        })
    }

    private formatDateToLocale(date: string, showWeekday = false): string {
        return this.helperService.formatISODateToLocale(date, showWeekday)
    }

    private getDistinctCustomers(): void {
        this.customers = []
        const x = [... new Set(this.records.embarkation.map(x => x.customer))]
        x.forEach(element => {
            this.customers.push({ label: element, value: element })
        })
    }

    private getDistinctDrivers(): void {
        this.drivers = []
        const x = [... new Set(this.records.embarkation.map(x => x.driver))]
        x.forEach(element => {
            this.drivers.push({ label: element, value: element })
        })
    }

    private getDistinctShips(): void {
        this.ships = []
        const x = [... new Set(this.records.embarkation.map(x => x.ship))]
        x.forEach(element => {
            this.ships.push({ label: element, value: element })
        })
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
            console.log(this.filteredRecords)
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.embarkationCriteria = {
                date: criteria.date,
                destination: criteria.destination,
                port: criteria.port,
                ship: criteria.ship
            }
        }
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    private refreshList(): void {
        this.router.navigate([this.url])
    }

    private setActiveClassOnSelectedPill(elementId: string) {
        const filters = document.getElementById('filters')
        Array.from(filters.children).forEach(child => {
            child.classList.remove('selected-filter')
        })
        document.getElementById(elementId).classList.add('selected-filter')
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updatePassengerStatusPills(): void {
        this.records.embarkation.forEach(record => {
            if (record.passengers.filter(x => x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.getLabel('boarded').toUpperCase()
            }
            if (record.passengers.filter(x => !x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.getLabel('pending').toUpperCase()
            }
            if (record.passengers.filter(x => x.isCheckedIn).length != record.passengers.length && record.passengers.filter(x => !x.isCheckedIn).length != record.passengers.length) {
                record.isCheckedIn = 'MIX'
            }
        })
    }

    //#endregion

}
