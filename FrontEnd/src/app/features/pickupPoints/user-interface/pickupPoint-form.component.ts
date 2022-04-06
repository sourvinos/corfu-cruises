import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MapComponent } from 'src/app/shared/components/map/map.component'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PickupPoint } from '../classes/models/pickupPoint'
import { PickupPointReadVM } from '../classes/view-models/pickupPoint-read-vm'
import { PickupPointService } from '../classes/services/pickupPoint.service'
import { PickupPointWriteVM } from '../classes/view-models/pickupPoint-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from '../../../shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { CoachRouteDropdownVM } from '../../coachRoutes/classes/view-models/coachRoute-dropdown-vm'
import { CoachRouteService } from '../../coachRoutes/classes/services/coachRoute.service'

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './pickupPoint-form.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class PickupPointFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'pickupPointForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/pickupPoints'
    public loading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public filteredRoutes: Observable<CoachRouteDropdownVM[]>
    public routes: CoachRouteDropdownVM[] = []
    public pickupPoints: PickupPoint[] = []

    public activePanel: string

    //#endregion

    @ViewChild(MapComponent) child: MapComponent

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pickupPointService: PickupPointService, private routeService: CoachRouteService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            if (x.id) {
                this.getRecord(x.id)
                this.getPickupPoints(x.id)
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

    public autocompleteFields(subject: { abbreviation: any }): any {
        return subject ? subject.abbreviation : undefined
    }

    public checkForEmptyAutoComplete(event: { target: { value: any } }) {
        if (event.target.value == '') this.isAutoCompleteDisabled = true
    }

    public enableOrDisableAutoComplete(event: any) {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.pickupPointService.delete(this.form.value.id).pipe(indicate(this.loading)).subscribe(() => {
                    this.resetForm()
                    this.goBack()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onFocusFormPanel(): void {
        this.activePanel = 'form'
        document.getElementById('formTab').classList.add('active')
        document.getElementById('mapTab').classList.remove('active')
        document.getElementById('form').style.display = 'flex'
    }

    public onFocusMapPanel(): void {
        this.activePanel = 'map'
        document.getElementById('formTab').classList.remove('active')
        document.getElementById('mapTab').classList.add('active')
        document.getElementById('map-outer-wrapper').style.display = 'flex'
        this.child.onRefreshMap()
    }


    public onSave(): void {
        this.saveRecord(this.flattenForm())
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

    private filterDropdownArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): PickupPointWriteVM {
        const pickupPoint = {
            id: this.form.value.id,
            routeId: this.form.value.route.id,
            description: this.form.value.description,
            exactPoint: this.form.value.exactPoint,
            time: this.form.value.time,
            coordinates: this.form.value.coordinates,
            isActive: this.form.value.isActive
        }
        return pickupPoint
    }

    private getRecord(id: number): void {
        this.pickupPointService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
        })
    }

    private getPickupPoints(id: string): void {
        this.pickupPointService.getSingle(id).subscribe(result => {
            this.pickupPoints.push(result)
        })
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            route: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            exactPoint: ['', [Validators.required, Validators.maxLength(128)]],
            time: ['', [Validators.required, ValidationService.isTime]],
            coordinates: ['00.00000000000000,00.000000000000000', [Validators.required]],
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string, addWildCard = false): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any[]) => {
                    if (addWildCard)
                        response.unshift({ id: null, description: this.emojiService.getEmoji('wildcard') })
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterDropdownArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropDowns(): void {
        this.populateDropDown(this.routeService, 'coachRoutes', 'filteredRoutes', 'route', 'abbreviation')
    }

    private populateFields(result: PickupPointReadVM): void {
        this.form.setValue({
            id: result.id,
            route: { 'id': result.route.id, 'abbreviation': result.route.abbreviation },
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
            coordinates: result.coordinates,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(pickupPoint: PickupPointWriteVM): void {
        if (pickupPoint.id === 0) {
            this.flattenForm()
            this.pickupPointService.add(pickupPoint).pipe(indicate(this.loading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.flattenForm()
            this.pickupPointService.update(pickupPoint.id, pickupPoint).pipe(indicate(this.loading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
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

    get route(): AbstractControl {
        return this.form.get('route')
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
