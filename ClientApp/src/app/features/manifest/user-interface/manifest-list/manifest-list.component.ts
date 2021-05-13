import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ManifestService } from '../../classes/services/manifest.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { QrScannerComponent } from 'angular2-qrscanner'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { ManifestViewModel } from '../../classes/view-models/manifest-view-model'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'manifestList'
    private unlisten: Unlisten
    private windowTitle = 'Manifest'
    public feature = 'manifestList'

    //#endregion

    //#region particular variables

    public filteredRecords: ManifestViewModel
    public openedClientFilters: boolean
    public records: ManifestViewModel
    public searchTerm: string

    public drivers = []
    public selectedDrivers = []
    public manifestStatus = []
    public selectedManifestStatus = []

    private chosenDevice: any
    public scannerEnabled: boolean
    public videoDevices: MediaDeviceInfo[] = []

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private manifestService: ManifestService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
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

    public onCamerasFound($event: any): void {
        $event.forEach((element: any) => {
            console.log(JSON.stringify(element))
        })
    }

    public onCheckRemarksLength(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoManifest(id: number): void {
        this.manifestService.boardPassenger(id).subscribe(() => {
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/manifest'])
    }

    public onHideScanner(): void {
        document.getElementById('video').style.display = 'none'
        this.scannerEnabled = false
    }

    public onToggleClientFilters(): void {
        this.openedClientFilters = !this.openedClientFilters
    }

    //#endregion

    //#region private methods

    private addActiveClassToSummaryItems(): void {
        setTimeout(() => {
            this.addActiveClassToElements('.item.manifestStatusFilter', this.selectedManifestStatus)
            this.addActiveClassToElements('.item.driverFilter', this.selectedDrivers)
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
        }
    }

    public personsAreNotMissing(record): boolean {
        if (record.totalPersons == record.passengers.length) {
            return true
        }
    }

    private updateSelectedArraysFromInitialResults(): void {
        this.manifestStatus.forEach(element => {
            this.selectedManifestStatus.push(element)
        })
    }

    public onUpdateSelectedItems(): void {
        this.getItemsFromLocalStorage()
        this.addActiveClassToSummaryItems()
    }

    private getItemsFromLocalStorage(): void {
        const localStorageData = JSON.parse(this.helperService.readItem('manifestFilters'))
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedManifestStatus = JSON.parse(localStorageData.manifestStatus)
    }

    //#endregion

}