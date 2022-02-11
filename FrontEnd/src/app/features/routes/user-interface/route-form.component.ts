import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MapComponent } from 'src/app/shared/components/map/map.component'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { Port } from '../../ports/classes/models/port'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { Route } from '../classes/models/route'
import { RouteService } from '../classes/services/route.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'route-form',
    templateUrl: './route-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './route-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class RouteFormComponent {

    //#region variables

    private feature = 'routeForm'
    private flatForm: FormGroup
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/routes'
    private windowTitle = 'Route'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public activePanel: string
    public pickupPoints = []
    public ports = []
    public filteredPorts: Observable<Port[]>

    //#endregion

    @ViewChild(MapComponent) child: MapComponent

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private portService: PortService, private routeService: RouteService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) {
                this.getRecord(p.id)
                this.getPickupPoints(p.id)
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
        this.onFocusFormPanel()
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
                this.routeService.delete(this.form.value.id).subscribe(() => {
                    this.resetForm()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.onGoBack()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onFocusMapPanel(): void {
        this.activePanel = 'map'
        document.getElementById('formTab').classList.remove('active')
        document.getElementById('mapTab').classList.add('active')
        document.getElementById('map-outer-wrapper').style.display = 'flex'
        this.child.onRefreshMap()
    }

    public onFocusFormPanel(): void {
        this.activePanel = 'form'
        document.getElementById('formTab').classList.add('active')
        document.getElementById('mapTab').classList.remove('active')
        document.getElementById('form').style.display = 'flex'
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public portFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public onGoBack(): void {
        this.router.navigate([this.url])
    }

    public onSave(): void {
        if (this.form.value.id === 0 || this.form.value.id === null) {
            this.flattenForm()
            this.routeService.add(this.flatForm.value).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.flattenForm()
            this.routeService.update(this.flatForm.value.id, this.flatForm.value).subscribe(() => {
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
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
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

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): void {
        this.flatForm = this.formBuilder.group({
            id: this.form.value.id,
            portId: this.form.value.port.id,
            abbreviation: this.form.value.abbreviation,
            description: this.form.value.description,
            isTransfer: this.form.value.isTransfer,
            isActive: this.form.value.isActive,
            userId: this.form.value.userId
        })
    }

    private getPickupPoints(id: string): void {
        this.pickupPointService.getAllForRoute(id).subscribe(result => {
            result.forEach(element => {
                this.pickupPoints.push(element)
            })
        })
    }

    private getRecord(id: number): void {
        this.routeService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            isTransfer: true,
            isActive: true,
            userId: this.helperService.readItem('userId')
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateFields(result: Route): void {
        this.form.setValue({
            id: result.id,
            abbreviation: result.abbreviation,
            description: result.description,
            port: { 'id': result.port.id, 'description': result.port.description },
            isTransfer: result.isTransfer,
            isActive: result.isActive,
            userId: this.helperService.readItem('userId')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
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

    get abbreviation(): AbstractControl {
        return this.form.get('abbreviation')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    //#endregion

}
