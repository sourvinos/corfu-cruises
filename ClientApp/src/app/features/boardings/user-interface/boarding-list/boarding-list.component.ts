import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { BoardingService } from '../../classes/boarding.service'
import { BoardingViewModel } from '../../classes/boarding-view-model'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { Port } from 'src/app/features/ports/classes/port'
import { PortService } from '../../../ports/classes/port.service'
import { Ship } from 'src/app/features/ships/classes/ship'
import { ShipService } from 'src/app/features/ships/classes/ship.service'
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
    private unlisten: Unlisten
    private resolver = 'boardingList'
    private windowTitle = 'Boarding'
    public feature = 'boardingList'

    //#endregion

    //#region particular variables

    public form: FormGroup
    public boardings: BoardingViewModel
    public destinationId = 2
    public portId = 2
    public shipId = 4
    public destinations: Destination[] = []
    public ports: Port[] = []
    public ships: Ship[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private boardingService: BoardingService, private titleService: Title) {
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

    ngAfterViewInit(): void {
        this.focus('date')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onCheckBoardingStatus(status: boolean): string {
        return status ? 'ok' : 'pending'
    }

    public onCheckRemarksLength(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoBoarding(id: string): void {
        this.boardingService.boardPassenger(id).subscribe(() => {
            this.refreshSummary()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public onGetBoardingStatus(status: boolean): string {
        return status ? this.onGetLabel('boardingStatusOK') : this.onGetLabel('boardingStatusPending')
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
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

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['2021-05-19', [Validators.required]]
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.boardings = listResolved.result
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private populateDropDowns(): void {
        this.destinationService.getAllActive().subscribe((result: any) => {
            this.destinations = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
        this.portService.getAllActive().subscribe((result: any) => {
            this.ports = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
        this.shipService.getAllActive().subscribe((result: any) => {
            this.ships = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
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

    //#endregion

}
