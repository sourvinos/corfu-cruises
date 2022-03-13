import { Component } from '@angular/core'
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import creditsJson from '../../../../assets/credits/credits.json'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from './../../../shared/services/messages-snackbar.service'
import { fancyAnimation } from '../../../shared/animations/animations'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

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
    public deviceInfo: DeviceInfo

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private deviceDetectorService: DeviceDetectorService, private dialogService: DialogService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.cleanup()
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
        window.open(url, '_blank')
    }

    public onShowDeviceInfo(): void {
        this.dialogService.open(this.messageSnackbarService.success(), 'infoColor', JSON.stringify(this.deviceDetectorService.getDeviceInfo()), ['ok'])
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
            priority: 0,
            inputs: true
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private cleanup(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

}

