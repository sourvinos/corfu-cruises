import { BoardingService } from '../../../classes/boarding.service'
import { MessageSnackbarService } from '../../../../../shared/services/messages-snackbar.service'
import { PortService } from '../../../../ports/classes/port.service'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { DateAdapter } from '@angular/material/core'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { Destination } from 'src/app/features/destinations/classes/destination'
import { Port } from 'src/app/features/ports/classes/port'
import { Ship } from 'src/app/features/ships/classes/ship'
import { ShipService } from 'src/app/features/ships/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { BoardingGroup } from '../../../classes/boarding-flat'

@Component({
    selector: 'boarding-list',
    templateUrl: './boarding-list.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './boarding-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BoardingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private resolver = 'boardingList'
    private windowTitle = 'Boarding'
    public feature = 'boardingWrapper'

    //#endregion

    //#region particular variables

    private dateISO = '2021-03-29'
    public form: FormGroup
    public boardings: BoardingGroup
    public destinationId = 2
    public portId = 2
    public shipId = 4
    public destinations: Destination[] = []
    public ports: Port[] = []
    public ships: Ship[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private boardingService: BoardingService, private titleService: Title) {
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

    public onDoBoarding(id: string): void {
        this.boardingService.boardPassenger(id).subscribe(() => {
            this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
        })

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

    // public onLoadBoardings(): void {
    //     if (this.onCheckValidDate()) {
    //         this.boardingService.get(this.dateISO, this.destinationId, this.portId, this.shipId).subscribe(result => {
    //             this.boardings = result
    //         })
    //     }
    // }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.boardings = listResolved.result
            console.log('All', this.boardings)
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
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

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    //#endregion    

}
