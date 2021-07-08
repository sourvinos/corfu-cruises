import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { EmbarkationCompositeViewModel } from '../../classes/view-models/embarkation-composite-view-model'
import { EmbarkationService } from '../../classes/services/embarkation.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { QrScannerComponent } from 'angular2-qrscanner'
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

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'embarkationList'
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationList'
    public filteredRecords: EmbarkationCompositeViewModel
    public records: EmbarkationCompositeViewModel
    public searchTerm: string
    public openedClientFilters: boolean

    public drivers = []
    public selectedDrivers = []
    public embarkationStatus = []
    public selectedEmbarkationStatus = []
    public isBoarded = true
    public isNotBoarded = true

    public scannerEnabled: boolean
    public videoDevices: MediaDeviceInfo[] = []
    private chosenDevice: any

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private embarkationervice: EmbarkationService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
                this.updateWithPassengerStatus()
                this.getDistinctDrivers()
                this.saveSelectedItems()
                this.isBoarded = true
                this.isNotBoarded = true
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.getLocale()
    }

    ngAfterViewInit(): void {
        this.updateSelectedArraysFromInitialResults()
        this.saveSelectedItems()
        this.addActiveClassToSummaryItems()
    }

    ngDoCheck(): void {
        this.getEmbarkationStatus()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onCamerasFound($event: any): void {
        $event.forEach((element: any) => {
            console.log(JSON.stringify(element))
        })
    }

    public onCheckRemarksLength(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoEmbarkation(id: number): void {
        this.embarkationervice.boardPassenger(id).subscribe(() => {
            this.refreshSummary()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    // public onFilterByEmbarkationStatus(variable: string): void {
    //     this[variable] = !this[variable]
    //     this.filterByCriteria()
    // }

    public onFilterByTicketNo(query: string): void {
        this.filteredRecords.embarkation = []
        this.records.embarkation.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.filteredRecords.embarkation.push(record)
            }
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/embarkation'])
    }

    public onHideScanner(): void {
        document.getElementById('video').style.display = 'none'
        this.scannerEnabled = false
    }

    public onScanSuccess($event: any): void {
        this.searchTerm = $event
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
        this.onFilterByTicketNo(this.searchTerm)
    }

    public onShowScanner(): void {
        if (this.checkForDevices()) {
            this.searchTerm = ''
            this.scannerEnabled = true
            setTimeout(() => { this.positionVideo() }, 1000)
            this.qrScannerComponent.startScanning(this.chosenDevice)
        } else {
            this.showSnackbar(this.messageSnackbarService.noVideoDevicesFound(), 'error')
        }
    }

    public onToggleClientFilters(): void {
        this.openedClientFilters = !this.openedClientFilters
    }

    // public onToggleItem(item: any, lookupArray: string[]): void {
    //     this.toggleActiveItem(item, lookupArray)
    //     this.filterByCriteria()
    // }

    public onFilterExclude(variable?: string): void {
        this.filteredRecords.embarkation = variable ? this.records.embarkation.filter(x => x.isBoarded != variable.toUpperCase()) : this.records.embarkation
        console.log('Filter', this.filteredRecords)
    }

    //#endregion

    //#region private methods

    private addActiveClassToSummaryItems(): void {
        setTimeout(() => {
            // this.addActiveClassToElements('.item.embarkationtatusFilter', this.selectedEmbarkationStatus)
            this.addActiveClassToElements('driverFilter', this.selectedDrivers)
        }, 1000)
    }

    private addActiveClassToElements(className: string, lookupArray: string[]): void {
        const elements = document.querySelectorAll(className)
        elements.forEach((element) => {
            const position = lookupArray.indexOf(element.id)
            if (position >= 0) {
                element.classList.add('activeItem')
            }
        })
    }

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
            priority: 1,
            inputs: true
        })
    }

    private checkForDevices(): boolean {
        let isCameraFound = false
        if (this.qrScannerComponent != undefined) {
            this.qrScannerComponent.getMediaDevices().then(devices => {
                console.log(devices)
                for (const device of devices) {
                    if (device.kind.toString() === 'videoinput') {
                        this.videoDevices.push(device)
                    }
                }
                if (this.videoDevices.length > 0) {
                    for (const dev of this.videoDevices) {
                        console.log('Video devices found', dev.label)
                        if (dev.label.includes('back')) {
                            this.chosenDevice = dev
                            break
                        }
                    }
                    if (this.chosenDevice) {
                        this.qrScannerComponent.chooseCamera.next(this.chosenDevice)
                        isCameraFound = true
                    } else {
                        this.qrScannerComponent.chooseCamera.next(this.videoDevices[0])
                        isCameraFound = true
                    }
                }
            })
        }
        return isCameraFound
        // this.qrScannerComponent.capturedQr.subscribe((result: string) => {
        //     this.searchTerm = result
        //     this.onHideScanner()
        //     this.onFilterByTicketNo(this.searchTerm)
        // })
    }

    // private filterByCriteria(): void {
    //     this.filteredRecords.embarkation = this.records.embarkation
    //         .filter((isBoarded) => this.selectedEmbarkationStatus.indexOf(isBoarded.isBoarded) !== -1 || (isBoarded.isBoarded === 'Mix' && this.selectedEmbarkationStatus.length > 0))
    // }

    private getDistinctDrivers(): void {
        this.drivers = [... new Set(this.records.embarkation.map(x => x.driver))]
        this.selectedDrivers = [... new Set(this.records.embarkation.map(x => x.driver))]
    }

    private getEmbarkationStatus(): void {
        this.embarkationStatus = [this.onGetLabel('boardedStatus'), this.onGetLabel('remainingStatus')]
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
            console.log(this.filteredRecords)
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    private refreshSummary(): void {
        this.interactionService.mustRefreshEmbarkationList()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private toggleActiveItem(item: string, lookupArray: string[]): void {
        const element = document.getElementById(item)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item)
            console.log(lookupArray)
        }
    }

    public personsAreNotMissing(record): boolean {
        if (record.totalPersons == record.passengers.length) {
            return true
        }
    }

    private updateSelectedArraysFromInitialResults(): void {
        this.embarkationStatus.forEach(element => {
            this.selectedEmbarkationStatus.push(element)
        })
    }

    private saveSelectedItems(): void {
        const summaryItems = {
            'embarkationtatus': JSON.stringify(this.selectedEmbarkationStatus),
            'drivers': JSON.stringify(this.selectedDrivers)
        }
        this.helperService.saveItem('embarkationFilters', JSON.stringify(summaryItems))
    }

    public onSaveSelectedItems(): void {
        this.saveSelectedItems()
    }

    public onUpdateSelectedItems(): void {
        this.getItemsFromLocalStorage()
        this.addActiveClassToSummaryItems()
    }

    private getItemsFromLocalStorage(): void {
        const localStorageData = JSON.parse(this.helperService.readItem('embarkationFilters'))
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedEmbarkationStatus = JSON.parse(localStorageData.embarkationtatus)
    }

    private scanVoucher(): void {
        this.qrScannerComponent.capturedQr.subscribe((result: string) => {
            this.searchTerm = result
            this.onHideScanner()
            this.onFilterByTicketNo(this.searchTerm)
        })
    }

    private updateWithPassengerStatus(): void {
        this.records.embarkation.forEach(record => {
            const isBoarded = record.passengers.filter(x => x.isCheckedIn)
            const isNotBoarded = record.passengers.filter(x => !x.isCheckedIn)
            if (isBoarded.length == record.passengers.length) {
                record.isBoarded = this.onGetLabel('boardedStatus')
            }
            if (isNotBoarded.length == record.passengers.length) {
                record.isBoarded = this.onGetLabel('remainingStatus')
            }
            if (isBoarded.length != record.passengers.length && isNotBoarded.length != record.passengers.length) {
                record.isBoarded = 'MIX'
            }
        })
    }

    //#endregion

}