import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ShipRouteReadVM } from '../classes/view-models/shipRoute-read-vm'
import { ShipRouteService } from '../classes/services/shipRoute.service'
import { ShipRouteWriteVM } from '../classes/view-models/shipRoute-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'ship-route-form',
    templateUrl: './shipRoute-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ShipRouteFormComponent {

    //#region variables 

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'shipRouteForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/shipRoutes'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private shipRouteService: ShipRouteService, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.getRecord(x.id) : null
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.askConfirmationToAbortEditing(), 'warning', ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    //#endregion

    //#region public methods

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.shipRouteService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.resetForm()
                        this.goBack()
                        this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    },
                    error: (errorFromInterceptor) => {
                        this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                    }
                })
            }
        })
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
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

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private flattenForm(): ShipRouteWriteVM {
        const shipRoute = {
            id: this.form.value.id,
            description: this.form.value.description,
            fromPort: this.form.value.fromPort,
            fromTime: this.form.value.fromTime,
            viaPort: this.form.value.viaPort,
            viaTime: this.form.value.viaTime,
            toPort: this.form.value.toPort,
            toTime: this.form.value.toTime,
            isActive: this.form.value.isActive
        }
        return shipRoute
    }

    private getRecord(id: number): void {
        this.shipRouteService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            description: ['', [Validators.required, Validators.maxLength(128)]],
            fromPort: ['', [Validators.maxLength(128)]], fromTime: ['', [Validators.required, ValidationService.isTime]],
            viaPort: ['', [Validators.maxLength(128)]], viaTime: ['', [ValidationService.isTime]],
            toPort: ['', [Validators.maxLength(128)]], toTime: ['', [Validators.required, ValidationService.isTime]],
            isActive: true
        })
    }

    private populateFields(result: ShipRouteReadVM): void {
        this.form.setValue({
            id: result.id,
            description: result.description,
            fromPort: result.fromPort, fromTime: result.fromTime,
            viaPort: result.viaPort, viaTime: result.viaTime,
            toPort: result.toPort, toTime: result.toTime,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(shipRoute: ShipRouteWriteVM): void {
        if (shipRoute.id === 0) {
            this.shipRouteService.add(shipRoute).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
                },
                error: (errorFromInterceptor) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                }
            })
        } else {
            this.shipRouteService.update(shipRoute.id, shipRoute).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                },
                error: (errorFromInterceptor) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                }
            })
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

    //#region getters

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get fromPort(): AbstractControl {
        return this.form.get('fromPort')
    }

    get fromTime(): AbstractControl {
        return this.form.get('fromTime')
    }

    get viaPort(): AbstractControl {
        return this.form.get('viaPort')
    }

    get viaTime(): AbstractControl {
        return this.form.get('viaTime')
    }

    get toPort(): AbstractControl {
        return this.form.get('toPort')
    }
    get toTime(): AbstractControl {
        return this.form.get('toTime')
    }

    get isActive(): AbstractControl {
        return this.form.get('isActive')
    }

    //#endregion

}
