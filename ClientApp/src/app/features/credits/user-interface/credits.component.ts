import { fancyAnimation } from '../../../shared/animations/animations'
import { Location } from '@angular/common'
import { Component } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { Router } from "@angular/router"
import { Subject } from "rxjs"
import { slideFromLeft, slideFromRight } from "src/app/shared/animations/animations"
import { ButtonClickService } from "src/app/shared/services/button-click.service"
import { HelperService } from "src/app/shared/services/helper.service"
import { KeyboardShortcuts, Unlisten } from "src/app/shared/services/keyboard-shortcuts.service"
import { MessageLabelService } from "src/app/shared/services/messages-label.service"
import creditsJson from '../../../../assets/credits/credits.json'

@Component({
    selector: 'credits',
    templateUrl: './credits.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './credits.component.css'],
    animations: [slideFromLeft, slideFromRight, fancyAnimation]
})

export class CreditsComponent {

    //#region variables

    private feature = 'credits'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/credits'
    private windowTitle = 'Credits'
    public credits = creditsJson

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private router: Router, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onClose(): void {
        this.location.back()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate([this.url])
    }

    public onGotoExternalLink(url: string): void {
        window.open(url, "_blank")
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'save')
                }
            },
            'Alt.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'abort')
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'ok')
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

}
