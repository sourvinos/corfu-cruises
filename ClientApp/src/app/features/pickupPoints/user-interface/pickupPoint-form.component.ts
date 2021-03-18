import { ValidationService } from '../../../shared/services/validation.service'
import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { RouteService } from 'src/app/features/routes/classes/route.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { PickupPoint } from '../classes/pickupPoint'
import { PickupPointService } from '../classes/pickupPoint.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MapComponent } from 'src/app/shared/components/map/map.component'

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './pickupPoint-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointFormComponent {

    //#region variables

    private feature = 'pickupPointForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '../../'
    private windowTitle = 'Pickup point'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    public activePanel: string
    private routeId: number
    private routes: any
    public pickupPoints = []

    //#endregion

    @ViewChild(MapComponent) child: MapComponent

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private routeService: RouteService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(p => {
            if (p.pickupPointId) {
                this.getRecord(p.pickupPointId)
                this.getPickupPoints(p.pickupPointId)
            } else {
                this.routeId = parseInt(this.router.url.split('/')[3], 10)
                this.patchRouteFields()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.onFocusFormPanel()
    }

    ngAfterViewInit(): void {
        this.focus('description')
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
                this.pickupPointService.delete(this.form.value.id).subscribe(() => {
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

    public onGoBack(): void {
        this.router.navigate([this.url], { relativeTo: this.activatedRoute })
    }

    public onSave(): void {
        if (this.form.value.id === 0 || this.form.value.id === null) {
            this.form.get('coordinates').enable()
            this.pickupPointService.add(this.form.value).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.form.get('coordinates').enable()
            this.pickupPointService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                this.resetForm()
                this.onGoBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    public onToggleFullScreen(): void {
        document.getElementById('form').style.display = 'none'
        document.getElementById('map').style.width = '100% !important'
    }

    public onUpdateCoordinates(element: any): void {
        this.form.patchValue({
            coordinates: element[1]
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
            priority: 0,
            inputs: true
        })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getPickupPoints(id: string): void {
        this.pickupPointService.getSingle(id).subscribe(result => {
            this.pickupPoints.push(result)
        })
    }

    private getRecord(id: number): void {
        this.pickupPointService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.onGoBack()
        })
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            routeId: [0, Validators.required], routeDescription: [{ value: '', disabled: true }, Validators.required],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            exactPoint: ['', [Validators.required, Validators.maxLength(128)]],
            time: ['', [Validators.required, ValidationService.isTime]],
            coordinates: [{ value: '', disabled: true }],
            isActive: true,
            userId: this.helperService.readItem('userId')
        })
    }

    private patchRouteFields(): void {
        setTimeout(() => {
            const route: any[] = this.routes.filter((x: { routeId: number }) => x.routeId === this.routeId)
            this.form.patchValue({
                routeId: this.routeId,
                routeDescription: route[0].routeDescription
            })
        }, 500)
    }

    private populateDropDowns(): Subscription {
        const sources = []
        sources.push(this.routeService.getAllActive())
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
                this.renameObjects()
            }
        )
    }

    private populateFields(result: PickupPoint): void {
        this.form.setValue({
            id: result.id,
            routeId: result.route.id, routeDescription: result.route.description,
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
            coordinates: result.coordinates,
            isActive: result.isActive,
            userId: this.helperService.readItem('userId')
        })
    }

    private renameKey(obj: unknown, oldKey: string, newKey: string): void {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects(): void {
        this.routes.forEach((obj: any) => {
            this.renameKey(obj, 'id', 'routeId')
            this.renameKey(obj, 'description', 'routeDescription')
            this.renameKey(obj, 'isActive', 'routeIsActive')
            this.renameKey(obj, 'userId', 'routeUserId')
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

    get routeDescription(): AbstractControl {
        return this.form.get('routeDescription')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get exactPoint(): AbstractControl {
        return this.form.get('exactPoint')
    }

    get time(): AbstractControl {
        return this.form.get('time')
    }

    get coordinates(): AbstractControl {
        return this.form.get('coordinates')
    }

    //#endregion


}
