import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Route } from 'src/app/features/routes/classes/route'
import { RouteService } from 'src/app/features/routes/classes/route.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'pickuppoint-wrapper',
    templateUrl: './pickupPoint-wrapper.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './pickupPoint-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Pickup points'
    public feature = 'pickupPointWrapper'

    //#endregion

    //#region particular variables

    public id = ''
    public routes: Route[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private routeService: RouteService, private router: Router, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.populateDropDowns()
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

    public onLoadPickupPoints(): void {
        this.navigateToList()
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
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns(): void {
        this.routeService.getAllActive().subscribe((result: any) => {
            this.routes = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    //#endregion

}
