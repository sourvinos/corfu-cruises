import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Crew } from '../classes/crew'
import { CrewService } from '../classes/crew.service'
import { DateAdapter } from '@angular/material/core'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { GenderResource } from '../classes/gender-resource'
import { GenderService } from 'src/app/features/genders/classes/gender.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { NationalityResource } from '../classes/nationality-resource'
import { NationalityService } from 'src/app/features/nationalities/classes/nationality.service'
import { PickupPointService } from 'src/app/features/pickupPoints/classes/pickupPoint.service'
import { ShipResource } from '../classes/ship-resource'
import { ShipService } from '../../base/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { map, startWith } from 'rxjs/operators'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'crew-form',
    templateUrl: './crew-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CrewFormComponent {

    //#region variables

    private feature = 'crewForm'
    private flatForm: FormGroup
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/shipCrews'
    private windowTitle = 'Crew'
    public form: FormGroup
    public input: InputTabStopDirective

    public ships: ShipResource[] = []
    public shipArray: Observable<ShipResource[]>
    public nationalities: NationalityResource[] = []
    public nationalityArray: Observable<NationalityResource[]>
    public genders: GenderResource[] = []
    public genderArray: Observable<GenderResource[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private crewService: CrewService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private pickupPointService: PickupPointService, private router: Router, private snackbarService: SnackbarService, private titleService: Title, private shipService: ShipService) {
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
        this.populateDropDown(this.shipService, 'ships', 'shipArray', 'ship', 'description')
        this.populateDropDown(this.nationalityService, 'nationalities', 'nationalityArray', 'nationality', 'description')
        this.populateDropDown(this.genderService, 'genders', 'genderArray', 'gender', 'description')

    }

    ngAfterViewInit(): void {
        this.focus('lastname')
    }

    ngDoCheck(): void {
        this.getLocale()
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

    public onDelete(): void {
        this.dialogService.open('warningColor', this.messageSnackbarService.askConfirmationToDelete(), ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.crewService.delete(this.form.value.id).subscribe(() => {
                    this.resetForm()
                    this.showSnackbar(this.messageSnackbarService.recordDeleted(), 'info')
                    this.goBack()
                }, errorFromInterceptor => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
            }
        })
    }

    public onDoPreSaveTasks(): void {
        this.flattenForm()
        this.saveRecord()
    }

    public onShipFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public shipFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public nationalityFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public genderFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
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
            lastname: this.form.value.lastname,
            firstname: this.form.value.firstname,
            birthdate: this.helperService.formatDateToISO(this.form.value.birthdate),
            shipId: this.form.value.ship.id,
            nationalityId: this.form.value.nationality.id,
            genderId: this.form.value.gender.id,
            isActive: this.form.value.isActive,
            userId: this.form.value.userId
        })
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem('language'))
    }

    private getRecord(id: number): void {
        this.crewService.getSingle(id).subscribe(result => {
            this.populateFields(result)
        }, errorFromInterceptor => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
            this.goBack()
        })
    }

    private goBack(): void {
        this.router.navigate([this.url])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required, Validators.maxLength(10)]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            isActive: true,
            userId: this.helperService.readItem('userId')
        })
    }

    private populateDropDown(service: any, table: any, array: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getAllActive().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[array] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateFields(result: Crew): void {
        this.form.setValue({
            id: result.id,
            lastname: result.lastname,
            firstname: result.firstname,
            birthdate: result.birthdate,
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            nationality: { 'id': result.nationality.id, 'description': result.nationality.description },
            gender: { 'id': result.gender.id, 'description': result.gender.description },
            isActive: result.isActive,
            userId: this.helperService.readItem('userId')
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(): void {
        if (this.flatForm.value.id === 0) {
            this.crewService.add(this.flatForm.value).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.crewService.update(this.flatForm.value.id, this.flatForm.value).subscribe(() => {
                this.resetForm()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
                this.goBack()
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
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

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    get birthdate(): AbstractControl {
        return this.form.get('birthdate')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get nationality(): AbstractControl {
        return this.form.get('nationality')
    }

    get gender(): AbstractControl {
        return this.form.get('gender')
    }

    //#endregion

}
