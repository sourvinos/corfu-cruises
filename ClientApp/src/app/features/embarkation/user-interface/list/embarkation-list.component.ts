import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
import { Title } from '@angular/platform-browser'
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
import { QrScannerComponent } from 'angular2-qrscanner'

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
    private videoDevices: MediaDeviceInfo[] = []
    private selectedVideoDevice: MediaDeviceInfo

    @ViewChild(QrScannerComponent, { static: false }) qrScannerComponent: QrScannerComponent

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

    ngAfterViewInit(): void {
        // this.getVideoDevices()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onClearAllFilters(table: Table): void {
        this.searchTerm = ''
        const input = (<HTMLInputElement>document.querySelectorAll('.p-inputtext')[0])
        input.value = ''
        table.reset()
        table.clear()
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

    public onShowScanner(): void {
        this.positionVideo()
        this.qrScannerComponent.getMediaDevices().then(devices => {
            console.log(devices)
            const videoDevices: MediaDeviceInfo[] = []
            for (const device of devices) {
                if (device.kind.toString() === 'videoinput') {
                    videoDevices.push(device)
                }
            }
            if (videoDevices.length > 0) {
                let choosenDev: MediaDeviceInfo
                for (const dev of videoDevices) {
                    if (dev.label.includes('front')) {
                        choosenDev = dev
                        break
                    }
                }
                if (choosenDev) {
                    this.qrScannerComponent.chooseCamera.next(choosenDev)
                } else {
                    this.qrScannerComponent.chooseCamera.next(videoDevices[0])
                }
            }
        })
        this.qrScannerComponent.capturedQr.subscribe((result: any) => {
            console.log(result)
        })
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
                this.buttonClickService.clickOnButton(event, 'showScanner')
            }
        }, {
            priority: 1,
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

    private getVideoDevices(): void {
        this.qrScannerComponent.getMediaDevices().then(devices => {
            console.log('Devices', devices)
            for (const device of devices) {
                if (device.kind.toString() === 'videoinput') {
                    this.videoDevices.push(device)
                }
            }
            if (this.videoDevices.length > 0) {
                // let choosenDev: MediaDeviceInfo
                for (const dev of this.videoDevices) {
                    console.log('Video Device', dev)
                    // choosenDev = dev
                    this.selectedVideoDevice = dev
                    console.log('Added video device', this.selectedVideoDevice)
                }
                // if (choosenDev) {
                //     this.qrScannerComponent.chooseCamera.next(choosenDev)
                // } else {
                //     console.log('Selected video device', this.videoDevices[0])
                //     this.qrScannerComponent.chooseCamera.next(this.videoDevices[0])
                // }
            }
        })
        this.qrScannerComponent.capturedQr.subscribe((result: any) => {
            console.log(result)
        })
        // this.qrScannerComponent.capturedQr.subscribe((result: string) => {
        //     console.log('Result', result)
        //     // const input = (<HTMLInputElement>document.querySelectorAll('.p-inputtext')[0])
        //     // input.value = result
        //     // this.filterByTicketNo(input.value)
        // })
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
    }

    public getTableHeight(): string {
        return '200px'
    }

    //#endregion

}
