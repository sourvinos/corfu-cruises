import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject } from 'rxjs'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortReadDto } from '../classes/dtos/port-read-dto'
import { PortService } from '../classes/services/port.service'
import { PortWriteDto } from '../classes/dtos/port-write-vm'

@Component({
    selector: 'port-form',
    templateUrl: './port-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css']
})

export class PortFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'portForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/ports'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private portService: PortService, private router: Router) {
        this.activatedRoute.params.subscribe(x => {
            if (x.id) {
                this.initForm()
                this.getRecord(x.id)
            } else {
                this.initForm()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.focusOnField('abbreviation')
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
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.portService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                    },
                    error: (errorFromInterceptor) => {
                        this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
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

    private flattenForm(): PortWriteDto {
        const port = {
            id: this.form.value.id,
            abbreviation: this.form.value.abbreviation,
            description: this.form.value.description,
            isPrimary: this.form.value.isPrimary,
            isActive: this.form.value.isActive
        }
        return port
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(id: number): void {
        this.portService.getSingle(id).subscribe({
            next: (response) => {
                this.populateFields(response)
            },
            error: (errorFromInterceptor) => {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
            }
        })
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            abbreviation: ['', [Validators.required, Validators.maxLength(5)]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            isPrimary: false,
            isActive: true
        })
    }

    private populateFields(result: PortReadDto): void {
        this.form.setValue({
            id: result.id,
            abbreviation: result.abbreviation,
            description: result.description,
            isPrimary: result.isPrimary,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(port: PortWriteDto): void {
        if (port.id === 0) {
            this.portService.add(port).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        } else {
            this.portService.update(port.id, port).pipe(indicate(this.isLoading)).subscribe({
                complete: () => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                },
                error: (errorFromInterceptor) => {
                    this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
                }
            })
        }
    }

    //#endregion

    //#region getters

    get abbreviation(): AbstractControl {
        return this.form.get('abbreviation')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    //#endregion

}
