import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { QrScannerComponent } from 'angular2-qrscanner'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { EmbarkationCompositeViewModel } from '../../classes/view-models/embarkation-composite-view-model'
import { EmbarkationService } from '../../classes/services/embarkation.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
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

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'embarkationList'
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationList'
    public filteredRecords: EmbarkationCompositeViewModel
    public records: EmbarkationCompositeViewModel
    public searchTerm: string

    private tempArray = []

    public customers = []
    public drivers = []

    public scannerEnabled: boolean
    public inputDevices: MediaDeviceInfo[] = []
    private chosenDevice: any

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private embarkationervice: EmbarkationService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
                this.updatePassengerStatus()
                this.getDistinctCustomers()
                this.getDistinctDrivers()
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

    public onDoCamerasTasks($event: any): void {
        console.log('1')
        $event.forEach((element: any) => {
            this.inputDevices.push(element)
            console.log(JSON.stringify(element))
        })
        console.log('Devices found', this.inputDevices)
        if (this.inputDevices.length > 0) {
            this.checkForVideoDevices()
        }
    }

    public onHasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoEmbarkation(id: number): void {
        this.embarkationervice.boardPassenger(id).subscribe(() => {
            this.refreshPage()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public onFilterByTicketNo(query: string): void {
        this.filteredRecords.embarkation = []
        this.records.embarkation.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.filteredRecords.embarkation.push(record)
            }
        })
    }

    public onFilterExclude(variable?: string): void {
        this.filteredRecords.embarkation = variable ? this.records.embarkation.filter(x => x.isCheckedIn != variable) : this.records.embarkation
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
        // if (this.checkForDevices()) {
        this.searchTerm = ''
        this.scannerEnabled = true
        setTimeout(() => { this.positionVideo() }, 1000)
        this.qrScannerComponent.startScanning(this.chosenDevice)
        // } else {
        // this.showSnackbar(this.messageSnackbarService.noVideoDevicesFound(), 'error')
        // }
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
            priority: 1,
            inputs: true
        })
    }

    private checkForVideoDevices(): boolean {
        console.log('2')
        let isCameraFound = false
        if (this.qrScannerComponent != undefined) {
            this.qrScannerComponent.getMediaDevices().then(devices => {
                console.log('Found', devices)
                for (const device of devices) {
                    if (device.kind.toString() === 'videoinput') {
                        this.inputDevices.push(device)
                        console.log('Added', this.inputDevices)
                    }
                }
                if (this.inputDevices.length > 0) {
                    for (const dev of this.inputDevices) {
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
                        this.qrScannerComponent.chooseCamera.next(this.inputDevices[0])
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

    private getDistinctCustomers(): void {
        this.tempArray = [... new Set(this.records.embarkation.map(x => x.customer))]
        this.tempArray.forEach(element => {
            this.customers.push({ label: element, value: element })
        })
    }

    private getDistinctDrivers(): void {
        this.tempArray = [... new Set(this.records.embarkation.map(x => x.driver))]
        this.tempArray.forEach(element => {
            this.drivers.push({ label: element, value: element })
        })
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
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

    private refreshPage(): void {
        this.helperService.refreshPage(this.router, this.router.url)
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private scanVoucher(): void {
        this.qrScannerComponent.capturedQr.subscribe((result: string) => {
            this.searchTerm = result
            this.onHideScanner()
            this.onFilterByTicketNo(this.searchTerm)
        })
    }

    private updatePassengerStatus(): void {
        this.records.embarkation.forEach(record => {
            if (record.passengers.filter(x => x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.onGetLabel('boarded').toUpperCase()
            }
            if (record.passengers.filter(x => !x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.onGetLabel('pending').toUpperCase()
            }
            if (record.passengers.filter(x => x.isCheckedIn).length != record.passengers.length && record.passengers.filter(x => !x.isCheckedIn).length != record.passengers.length) {
                record.isCheckedIn = 'MIX'
            }
        })
        console.log(this.records.embarkation)
    }

    public getTableHeight(): string {
        return '200px'
    }

    //#endregion

}