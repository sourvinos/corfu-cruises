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
import { ShipOwnerReadVM } from '../classes/view-models/shipOwner-read-vm'
import { ShipOwnerService } from '../classes/services/shipOwner.service'
import { ShipOwnerWriteVM } from '../classes/view-models/shipOwner-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'ship-owner-form',
    templateUrl: './shipOwner-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ShipOwnerFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'shipOwnerForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/shipOwners'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private shipOwnerService: ShipOwnerService, private snackbarService: SnackbarService, private titleService: Title) {
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
            this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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
        this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.shipOwnerService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe(() => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
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
        }, {
            priority: 0,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private flattenForm(): ShipOwnerWriteVM {
        const shipOwner = {
            id: this.form.value.id,
            description: this.form.value.description,
            profession: this.form.value.profession,
            address: this.form.value.address,
            taxNo: this.form.value.taxNo,
            city: this.form.value.city,
            phones: this.form.value.phones,
            email: this.form.value.email,
            isActive: this.form.value.isActive
        }
        return shipOwner
    }

    private getRecord(id: number): void {
        this.shipOwnerService.getSingle(id).subscribe(result => {
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
            profession: ['', [Validators.maxLength(128)]],
            address: ['', [Validators.maxLength(128)]],
            taxNo: ['', [Validators.maxLength(128)]],
            city: ['', [Validators.maxLength(128)]],
            phones: ['', [Validators.maxLength(128)]],
            email: ['', [Validators.email, Validators.maxLength(128)]],
            isActive: true
        })
    }

    private populateFields(result: ShipOwnerReadVM): void {
        this.form.setValue({
            id: result.id,
            description: result.description,
            profession: result.profession,
            address: result.address,
            taxNo: result.taxNo,
            city: result.city,
            phones: result.phones,
            email: result.email,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(shipOwner: ShipOwnerWriteVM): void {
        if (shipOwner.id === 0) {
            this.shipOwnerService.add(shipOwner).pipe(indicate(this.isLoading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            })
        } else {
            this.shipOwnerService.update(shipOwner.id, shipOwner).pipe(indicate(this.isLoading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
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

    get profession(): AbstractControl {
        return this.form.get('profession')
    }

    get address(): AbstractControl {
        return this.form.get('address')
    }

    get taxNo(): AbstractControl {
        return this.form.get('taxNo')
    }

    get city(): AbstractControl {
        return this.form.get('city')
    }

    get phones(): AbstractControl {
        return this.form.get('phones')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    //#endregion

}
