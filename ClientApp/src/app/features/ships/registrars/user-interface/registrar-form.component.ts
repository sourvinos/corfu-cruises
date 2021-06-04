import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { forkJoin, Subject, Subscription } from 'rxjs'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { Registrar } from '../classes/registrar'
import { RegistrarService } from '../classes/registrar.service'
import { ShipService } from '../../base/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'registrar-form',
    templateUrl: './registrar-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class RegistrarFormComponent {

    //#region variables

    private feature = 'registrarForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/registrars'
    private windowTitle = 'Route'
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public ships: any

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private registrarService: RegistrarService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        this.focus('fullname')
    }

    ngOnDestroy(): void {
        this.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.onGoBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    //#endregion

    //#region public methods

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.registrarService.delete(this.form.value.id).subscribe(() => {
                    this.resetForm()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate([this.url])
    }

    public onLookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[], value: { target: any }): void {
        let filteredArray = []
        lookupArray.filter(x => {
            filteredArray = this.helperService.pushItemToFilteredArray(x, fields[1], value, filteredArray)
        })
        if (filteredArray.length === 0) {
            this.clearFields(null, formFields[0], formFields[1])
        }
        if (filteredArray.length === 1) {
            const [...elements] = filteredArray
            this.patchFields(elements[0], fields)
        }
        if (filteredArray.length > 1) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify, types)
        }
    }

    public onSave(): void {
        if (this.form.value.id === 0) {
            this.registrarService.add(this.form.value).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.registrarService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.resetForm()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                this.onGoBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    public onUpdateCoordinates(element: any): void {
        this.pickupPointService.updateCoordinates(element[0], element[1]).subscribe(() => {
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
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

    private clearFields(result: any, id: any, description: any): void {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getRecord(id: number): void {
        this.registrarService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            shipId: ['', Validators.required], shipDescription: ['', Validators.required],
            fullname: ['', [Validators.required, Validators.maxLength(128)]],
            phones: ['', Validators.maxLength(128)],
            email: ['', [Validators.maxLength(128), Validators.email]],
            fax: ['', Validators.maxLength(128)],
            address: ['', Validators.maxLength(128)],
            isPrimary: true,
            isActive: true,
            userId: this.helperService.readItem('userId')
        })
    }

    private patchFields(result: any, fields: any[]): void {
        if (result) {
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        } else {
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
        }
    }

    private populateDropDowns(): Subscription {
        const sources = []
        sources.push(this.shipService.getAllActive())
        return forkJoin(sources).subscribe(
            result => {
                this.ships = result[0]
                this.renameObjects()
            }
        )
    }

    private populateFields(result: Registrar): void {
        this.form.setValue({
            id: result.id,
            fullname: result.fullname,
            shipId: result.shipId,
            shipDescription: result.shipDescription,
            phones: result.phones,
            email: result.email,
            fax: result.fax,
            address: result.address,
            isPrimary: result.isPrimary,
            isActive: result.isActive,
            userId: this.helperService.readItem('userId')
        })
    }

    private renameKey(obj: any, oldKey: string, newKey: string): void {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects(): void {
        this.ships.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'shipId')
            this.renameKey(obj, 'description', 'shipDescription')
            this.renameKey(obj, 'isActive', 'shipIsActive')
            this.renameKey(obj, 'userId', 'shipUserId')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showModalIndex(elements: any, title: string, fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], types: any[]): void {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
            data: {
                records: elements,
                title: title,
                fields: fields,
                headers: headers,
                widths: widths,
                visibility: visibility,
                justify: justify,
                types: types,
                highlightFirstRow: true
            }
        })
        dialog.afterClosed().subscribe((result) => {
            this.patchFields(result, fields)
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region getters

    get fullname(): AbstractControl {
        return this.form.get('fullname')
    }

    get shipId(): AbstractControl {
        return this.form.get('shipId')
    }

    get shipDescription(): AbstractControl {
        return this.form.get('shipDescription')
    }

    get phones(): AbstractControl {
        return this.form.get('phones')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get fax(): AbstractControl {
        return this.form.get('fax')
    }
    get address(): AbstractControl {
        return this.form.get('address')
    }

    //#endregion

}
