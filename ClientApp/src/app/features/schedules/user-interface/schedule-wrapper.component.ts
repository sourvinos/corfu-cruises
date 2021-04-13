import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'

import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Destination } from '../../destinations/classes/destination'
import { DestinationService } from '../../destinations/classes/destination.service'
import { FormGroup } from '@angular/forms'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from '../../ports/classes/port'
import { PortService } from '../../ports/classes/port.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { DateAdapter } from '@angular/material/core'

@Component({
    selector: 'schedule-wrapper',
    templateUrl: './schedule-wrapper.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './schedule-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ScheduleWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Schedules'
    public feature = 'scheduleWrapper'
    private baseUrl = '/schedules'

    //#endregion

    //#region particular variables

    public destinationId = ''
    public destinations: Destination[] = []
    public portId = ''
    public ports: Port[] = []
    public form: FormGroup
    public environment = environment.production

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private buttonClickService: ButtonClickService,
        private destinationService: DestinationService,
        private dateAdapter: DateAdapter<any>,
        private helperService: HelperService,
        private keyboardShortcutsService: KeyboardShortcuts,
        private messageLabelService: MessageLabelService,
        private portService: PortService,
        private router: Router,
        private titleService: Title
    ) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.populateDropDowns()
        this.getLocale()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onLoadSchedules(): void {
        this.navigateToList()
    }

    public gotoWrapperUrl(): void {
        this.router.navigate([this.baseUrl])
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private navigateToList(): void {
        this.router.navigate(['schedules/destinationId/' + this.destinationId + '/portId/' + this.portId])
    }

    private populateDropDowns(): void {
        this.destinationService.getAllActive().subscribe((result: any) => {
            this.destinations = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
        this.portService.getAllActive().subscribe((result: any) => {
            this.ports = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private toggleActiveItem(item: string, lookupArray: string): void {
        const elements = document.getElementsByClassName(lookupArray)
        const element = document.getElementById(item)
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            element.classList.remove('activeItem')
        }
        element.classList.add('activeItem')
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    //#endregion

}

