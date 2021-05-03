import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { BoardingCompositeViewModel } from '../../classes/view-models/boarding-composite-view-model'
import { BoardingService } from '../../classes/services/boarding.service'
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
    selector: 'boarding-list',
    templateUrl: './boarding-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './boarding-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BoardingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'boardingList'
    private unlisten: Unlisten
    private windowTitle = 'Boarding'
    public feature = 'boardingList'

    //#endregion

    //#region particular variables

    // public boardingStatus = '2'
    public filteredRecords: BoardingCompositeViewModel
    public form: FormGroup
    public openedClientFilters = true
    public records: BoardingCompositeViewModel
    public searchTerm: string
    public driver: string
    // public selectedBoardingStatus = []
    public theme = ''

    public drivers = []
    public selectedDrivers = []

    public boardingStatus = []
    public selectedBoardingStatus = []

    private chosenDevice: any
    public videoDevices: MediaDeviceInfo[] = []

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private boardingService: BoardingService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
                this.updateWithPassengerStatus()
                this.getDistinctDrivers()
                this.getBoardingStatus()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.getTheme()
    }
    ngAfterViewInit(): void {
        this.updateSelectedArraysFromInitialResults()
        this.saveSelectedItemsToLocalStorage()
    }

    ngDoCheck(): void {
        this.compareCurrentThemeWithLocalStorage()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onCheckRemarksLength(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoBoarding(id: number): void {
        this.boardingService.boardPassenger(id).subscribe(() => {
            this.refreshSummary()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    // public onFilterByDriver(): void {
    //     this.filteredRecords.boardings = []
    //     this.records.boardings.forEach((record) => {
    //         if (record.driver.includes(this.selectedDriver) || this.selectedDriver.trim() == '') {
    //             this.filteredRecords.boardings.push(record)
    //         }
    //     })
    // }

    // public onFilterByBoardingStatus(): void {
    //     this.filteredRecords.boardings = []
    //     this.records.boardings.forEach((record) => {
    //         const detail = record.passengers
    //         detail.forEach((element) => {
    //             if (this.determineBoardingStatus(element.isCheckedIn) == this.boardingStatus || this.boardingStatus == '2') {
    //                 this.filteredRecords.boardings.push(record)
    //             }
    //         })
    //     })
    // }

    public onFilterByTicketNo(query: string): void {
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            if (record.ticketNo.toLowerCase().includes(query)) {
                this.filteredRecords.boardings.push(record)
            }
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/boarding'])
    }

    public onHideScanner(): void {
        document.getElementById('video').style.display = 'none'
        this.qrScannerComponent.stopScanning()
    }

    public onShowScanner(): void {
        this.checkForDevices()
        this.searchTerm = ''
        setTimeout(() => { this.positionVideo() }, 1000)
        this.qrScannerComponent.startScanning(this.chosenDevice)
    }

    public onToggleItem(item: any, lookupArray: string[]): void {
        this.toggleActiveItem(item, lookupArray)
        this.filterByCriteria()
        // this.updateTotals()
        // this.saveSelectedItemsToLocalStorage()
        // this.updateParentCheckBox(className, indeterminate, checkedVariable)
    }

    //#endregion

    //#region private methods

    private addActiveClassToSummaryItems(): void {
        setTimeout(() => {
            this.addActiveClassToElements('.item.boardingStatus', this.selectedBoardingStatus)
            this.addActiveClassToElements('.item.driver', this.selectedDrivers)
        }, 100)
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

    private checkForDevices(): void {
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
                    if (dev.label.includes('Lenovo')) {
                        this.chosenDevice = dev
                        break
                    }
                }
                if (this.chosenDevice) {
                    this.qrScannerComponent.chooseCamera.next(this.chosenDevice)
                } else {
                    this.qrScannerComponent.chooseCamera.next(this.videoDevices[0])
                }
            } else {
                this.showSnackbar(this.messageSnackbarService.noVideoDevicesFound(), 'error')
            }
        })
        this.qrScannerComponent.capturedQr.subscribe((result: string) => {
            this.searchTerm = result
            this.onHideScanner()
            this.onFilterByTicketNo(this.searchTerm)
        })
    }

    private compareCurrentThemeWithLocalStorage(): void {
        if (localStorage.getItem('theme') != this.theme) {
            this.theme = localStorage.getItem('theme')
        }
    }

    private determineBoardingStatus(status: boolean): string {
        switch (status) {
            case true: return '1'
            case false: return '0'
        }
    }

    private filterByCriteria(): void {
        this.filteredRecords.boardings = this.records.boardings
            .filter((driver) => this.selectedDrivers.indexOf(driver.driver) !== -1)
            .filter((isBoarded) => this.selectedBoardingStatus.indexOf(isBoarded.isBoarded) !== -1 || (isBoarded.isBoarded === 'Mix' && this.selectedBoardingStatus.length > 0))
    }

    private getDistinctDrivers(): void {
        this.drivers = [... new Set(this.records.boardings.map(x => x.driver))]
        this.selectedDrivers = [... new Set(this.records.boardings.map(x => x.driver))]
    }

    private getBoardingStatus(): void {
        this.boardingStatus = ['Boarded', 'Pending']
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private getTheme(): void {
        this.theme = localStorage.getItem('theme')
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            driverId: 0
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
            console.log('records', this.records)
            console.log('filteredRecords', this.filteredRecords)
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
        this.interactionService.mustRefreshBoardingList()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    public toggleClientFilters(): void {
        this.openedClientFilters = !this.openedClientFilters
    }

    private toggleActiveItem(item, lookupArray: string[]): void {
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
        }
    }

    public close(): void {
        if (this.openedClientFilters) this.toggleClientFilters()
    }

    public personsAreNotMissing(record: { totalPersons: any; passengers: string | any[] }): boolean {
        if (record.totalPersons == record.passengers.length) {
            return true
        }
    }

    private updateSelectedArraysFromInitialResults(): void {
        this.boardingStatus.forEach(element => {
            this.selectedBoardingStatus.push(element)
        })
    }

    private saveSelectedItemsToLocalStorage(): void {
        const summaryItems = {
            'boardingStatus': JSON.stringify(this.selectedBoardingStatus),
            'drivers': JSON.stringify(this.selectedDrivers)
        }
        this.helperService.saveItem('boarding', JSON.stringify(summaryItems))
    }

    public showMe(isOpen: any): void {
        if (!isOpen) {
            this.saveSelectedItemsToLocalStorage()
        } else {
            this.getItemsFromLocalStorage()
            this.addActiveClassToSummaryItems()
        }
    }

    private getItemsFromLocalStorage(): void {
        const localStorageData = JSON.parse(this.helperService.readItem('boarding'))
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedBoardingStatus = JSON.parse(localStorageData.boardingStatus)
        // console.log('from localstorage', this.selectedDrivers)
        // console.log('from localstorage', this.selectedBoardingStatus)
    }

    private updateWithPassengerStatus(): void {
        this.records.boardings.forEach(record => {
            const isBoarded = record.passengers.filter(x => x.isCheckedIn)
            const isNotBoarded = record.passengers.filter(x => !x.isCheckedIn)
            console.log('isBoarded', isBoarded.length, 'Count', record.passengers.length)
            console.log('isNotBoarded', isNotBoarded.length)
            if (isBoarded.length == record.passengers.length) {
                record.isBoarded = 'Boarded'
            }
            if (isNotBoarded.length == record.passengers.length) {
                record.isBoarded = 'Pending'
            }
            if (isBoarded.length != record.passengers.length && isNotBoarded.length != record.passengers.length) {
                record.isBoarded = 'Mix'
            }
            // record.passengers.forEach(passenger => {
            // console.log('Ticket', record.ticketNo, 'Passenger', passenger)
            // })
        })
        console.log('After', this.records)
    }

    //#endregion

}