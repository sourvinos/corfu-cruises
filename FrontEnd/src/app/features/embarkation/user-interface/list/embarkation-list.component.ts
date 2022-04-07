import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { EmbarkationVM } from '../../classes/view-models/embarkation-vm'
import { EmbarkationService } from '../../classes/services/embarkation.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { DialogService } from 'src/app/shared/services/dialog.service'

@Component({
    selector: 'embarkation-list',
    templateUrl: './embarkation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EmbarkationListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'embarkationList'
    public icon = 'arrow_back'
    private url = ''
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationList'
    public filteredRecords: EmbarkationVM
    public records: EmbarkationVM
    public parentUrl = '/embarkation'
    public loading = new Subject<boolean>()

    private temp = []
    public customers = []
    public drivers = []
    public ships = []

    public scannerEnabled: boolean
    public searchTerm: string
    public embarkationCriteria: any = {}

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private buttonClickService: ButtonClickService,
        private dateAdapter: DateAdapter<any>,
        private dialogService: DialogService,
        private emojiService: EmojiService,
        private helperService: HelperService,
        private keyboardShortcutsService: KeyboardShortcuts,
        private localStorageService: LocalStorageService,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageSnackbarService,
        private router: Router,
        private snackbarService: SnackbarService,
        private embarkationervice: EmbarkationService,
        private titleService: Title
    ) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.updatePassengerStatus()
                this.populateCriteriaFromStoredVariables()
                this.getDistinctCustomers()
                this.getDistinctDrivers()
                this.getDistinctShips()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.getLocale()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public embarkPassenger(id: number): void {
        this.embarkationervice.boardPassenger(id).pipe(indicate(this.loading)).subscribe(() => {
            this.refreshList()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    private formatDateToLocale(date: string, showWeekday = false): string {
        return this.helperService.formatISODateToLocale(date, showWeekday)
    }

    public doFilterTasks(elementId: string, variable?: string): void {
        this.filterByEmbarkationStatus(variable)
        this.setActiveClassOnSelectedFilter(elementId)
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

    public showDate(): string {
        return this.formatDateToLocale(this.embarkationCriteria.date, true)
    }

    public onHasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
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

    public showRemarks(remarks: string): void {
        this.dialogService.open(this.getLabel('remarks'), 'warningColor', remarks, ['ok'])
    }

    public doSomething(event: string): void {
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
        this.filterByTicketNo(event)
    }

    public hasDevices(): void {
        console.log('Devices found')
    }

    public camerasFound(): void {
        console.log('Camera list')
    }

    public replaceWildcardWithText(criteria: string): string {
        if (criteria.includes(this.emojiService.getEmoji('wildcard'))) {
            return this.emojiService.getEmoji('wildcard')
        } else {
            return criteria
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

    private filterByTicketNo(query: string): void {
        this.filteredRecords.embarkation = []
        this.records.embarkation.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.filteredRecords.embarkation.push(record)
            }
        })
    }

    private filterByEmbarkationStatus(variable?: string): void {
        console.log(variable)
        this.filteredRecords.embarkation = variable ? this.records.embarkation.filter(x => x.isCheckedIn != variable) : this.records.embarkation
    }

    private getDistinctCustomers(): void {
        this.temp = [... new Set(this.records.embarkation.map(x => x.customer))]
        this.temp.forEach(element => {
            this.customers.push({ label: element, value: element })
        })
    }

    private getDistinctDrivers(): void {
        this.temp = [... new Set(this.records.embarkation.map(x => x.driver))]
        this.temp.forEach(element => {
            this.drivers.push({ label: element, value: element })
        })
    }

    private getDistinctShips(): void {
        this.temp = [... new Set(this.records.embarkation.map(x => x.ship))]
        this.temp.forEach(element => {
            this.ships.push({ label: element, value: element })
        })
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
            console.log(this.records)
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

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updatePassengerStatus(): void {
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

    private setActiveClassOnSelectedFilter(elementId: string) {
        const filters = document.getElementById('filters')
        Array.from(filters.children).forEach(child => {
            child.classList.remove('selected-filter')
        })
        document.getElementById(elementId).classList.add('selected-filter')
    }

    //#endregion

}
