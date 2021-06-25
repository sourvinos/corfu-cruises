import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { takeUntil } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { Destination } from 'src/app/features/destinations/classes/destination'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from 'src/app/features/ports/classes/port'
import { PortService } from 'src/app/features/ports/classes/port.service'
import { Ship } from 'src/app/features/ships/base/classes/ship'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'embarkation-wrapper',
    templateUrl: './embarkation-wrapper.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EmbarkationWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Embarkation'
    public feature = 'embarkationWrapper'

    //#endregion

    //#region particular variables

    private dateISO = ''
    public destinations: Destination[] = []
    public ports: Port[] = []
    public ships: Ship[] = []
    public form: FormGroup
    public openedServerFilters = true

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private portService: PortService, private router: Router, private shipService: ShipService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.populateDropDowns()
        this.subscribeToInteractionService()
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

    public onLoadEmbarkation(): void {
        if (this.checkValidDate()) {
            this.navigateToList()
            this.close()
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
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private checkValidDate(): boolean {
        const date = this.form.value.date
        if (moment(moment(date, 'DD/MM/YYYY')).isValid()) {
            this.dateISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateISO = moment(this.dateISO).format('YYYY-MM-DD')
            return true
        } else {
            this.dateISO = ''
            return false
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            destinationId: [0, [Validators.required, ValidationService.isGreaterThanZero]],
            portId: [0, [Validators.required, ValidationService.isGreaterThanZero]],
            shipId: [0, [Validators.required, ValidationService.isGreaterThanZero]]
        })
    }

    private navigateToList(): void {
        this.router.navigate(['date', this.dateISO, 'destinationId', this.form.value.destinationId, 'portId', this.form.value.portId, 'shipId', this.form.value.shipId], { relativeTo: this.activatedRoute })
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
        this.interactionService.refreshEmbarkationList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.onLoadEmbarkation()
        })
    }

    public toggleServerFilters(): void {
        this.openedServerFilters = !this.openedServerFilters
    }

    public close(): void {
        if (this.openedServerFilters) this.toggleServerFilters()
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    //#endregion    

}
