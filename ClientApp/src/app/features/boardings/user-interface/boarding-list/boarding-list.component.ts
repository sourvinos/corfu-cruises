import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { BoardingService } from '../../classes/boarding.service'
import { BoardingViewModel } from './../../classes/boarding-view-model'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { Driver } from 'src/app/features/drivers/classes/driver'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { QrScannerComponent } from 'angular2-qrscanner'

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

    public boardingStatus = '2'
    public filteredRecords: BoardingViewModel
    public form: FormGroup
    public openedClientFilters = false
    public records: BoardingViewModel
    public searchTerm: string
    public driver: string
    public selectedBoardingStatus = []

    public drivers: Driver[] = []
    public selectedDriver = ''

    private chosenDevice: any
    public videoDevices: MediaDeviceInfo[] = []

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent

    //#endregion

    constructor(private driverService: DriverService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private boardingService: BoardingService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDowns()
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

    public onFilterByDriver(): void {
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            if (record.driver.includes(this.selectedDriver) || this.selectedDriver.trim() == '') {
                this.filteredRecords.boardings.push(record)
            }
        })
    }

    public onFilterByBoardingStatus(): void {
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            const detail = record.passengers
            detail.forEach((element) => {
                if (!this.filteredRecords.boardings.find(({ ticketNo }) => ticketNo === record.ticketNo)) {
                    if (this.determineBoardingStatus(element.isCheckedIn) == this.boardingStatus || this.boardingStatus == '2') {
                        this.filteredRecords.boardings.push(record)
                    }
                }
            })
        })
    }

    public onFilterByTicketNo(query: string): void {
        // this.searchTerm = query
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            console.log(record)
            if (record.ticketNo.includes(query)) {
                this.filteredRecords.boardings.push(record)
            }
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onHideScanner(): void {
        document.getElementById('video').style.display = 'none'
        this.qrScannerComponent.stopScanning()
    }

    public onShowScanner(): void {
        this.checkForDevices()
        this.searchTerm = ''
        setTimeout(() => {
            document.getElementById('video').style.display = 'block'
        }, 500)
        this.qrScannerComponent.startScanning(this.chosenDevice)
    }

    public onToggleItem(item: any, lookupArray: string[]): void {
        this.toggleActiveItem(item, lookupArray)
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
                    if (dev.label.includes('back')) {
                        this.chosenDevice = dev
                        break
                    }
                }
                if (this.chosenDevice) {
                    this.qrScannerComponent.chooseCamera.next(this.chosenDevice)
                } else {
                    this.qrScannerComponent.chooseCamera.next(this.videoDevices[0])
                }
            }
        })
        this.qrScannerComponent.capturedQr.subscribe((result: string) => {
            this.searchTerm = result
            this.onHideScanner()
            this.onFilterByTicketNo(this.searchTerm)
        })
    }

    private determineBoardingStatus(status: boolean): string {
        switch (status) {
            case true: return '1'
            case false: return '0'
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['2021-03-30', [Validators.required]],
            driverId: 0
        })
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

    private toggleActiveItem(item: { description: string }, lookupArray: string[]): void {
        const element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item.description) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item.description)
        }
    }

    public close(): void {
        if (this.openedClientFilters) this.toggleClientFilters()
    }

    private populateDropDowns(): void {
        this.driverService.getAllActive().subscribe((result: any) => {
            this.drivers = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    public personsAreNotMissing(record: { totalPersons: any; passengers: string | any[] }): boolean {
        if (record.totalPersons == record.passengers.length) {
            return true
        }
    }

    //#endregion

    private focus(element: string): void {
        this.helperService.setFocus(element)
    }

}