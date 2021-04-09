import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
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
import moment from 'moment'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'boarding-wrapper',
    templateUrl: './boarding-wrapper.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './boarding-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class boardingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Boarding'
    public feature = 'boardingList'

    //#endregion

    //#region particular variables

    private dateInISO = '2021-03-30';
    private mustRefreshBoardingList = true
    public dateIn = ''
    public destinationId = 1
    public portId = 2
    public shipId = 2
    public form: FormGroup
    public records: string[] = []
    public destinations: Destination[] = []
    public ports: Port[] = []
    public ships: Ship[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private portService: PortService, private router: Router, private shipService: ShipService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDowns()
        this.subscribeToInteractionService()
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

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onLoadBoardings(): void {
        if (this.checkValidDate()) {
            this.navigateToList()
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

    private checkValidDate(): boolean {
        const date = (<HTMLInputElement>document.getElementById('date')).value
        if (moment(moment(date, 'DD/MM/YYYY')).isValid()) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        } else {
            this.dateInISO = ''
            return false
        }
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['2021-03-30', [Validators.required]]
        })
    }

    private navigateToList(): void {
        this.router.navigate([this.dateInISO, this.destinationId, this.portId, this.shipId], { relativeTo: this.activatedRoute })
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

    private subscribeToInteractionService(): void {
        this.interactionService.refreshBoardingList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.onLoadBoardings()
        })
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    //#endregion    

}
