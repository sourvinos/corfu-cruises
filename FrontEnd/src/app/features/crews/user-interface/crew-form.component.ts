import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CrewReadVM } from '../classes/view-models/crew-read-vm'
import { CrewService } from '../classes/services/crew.service'
import { CrewWriteVM } from '../classes/view-models/crew-write-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { GenderAutocompleteVM } from '../../genders/classes/view-models/gender-autocomplete-vm'
import { GenderService } from 'src/app/features/genders/classes/services/gender.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { NationalityAutocompleteVM } from '../../nationalities/classes/view-models/nationality-autocomplete-vm'
import { NationalityService } from 'src/app/features/nationalities/classes/services/nationality.service'
import { ShipDropdownVM } from '../../ships/classes/view-models/ship-dropdown-vm'
import { ShipService } from '../../ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'crew-form',
    templateUrl: './crew-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CrewFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'crewForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/crews'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public genderDropdown: Observable<GenderAutocompleteVM[]>
    public nationalityDropdown: Observable<NationalityAutocompleteVM[]>
    public shipDropdown: Observable<ShipDropdownVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private crewService: CrewService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private nationalityService: NationalityService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.getRecord(x.id).then(() => { this.populateDropDowns() }) : this.populateDropDowns()
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.subscribeToInteractionService()
        this.setLocale()
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

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
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
                this.crewService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe(() => {
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

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): CrewWriteVM {
        const crew = {
            id: this.form.value.id,
            shipId: this.form.value.ship.id,
            genderId: this.form.value.gender.id,
            nationalityId: this.form.value.nationality.id,
            lastname: this.form.value.lastname,
            firstname: this.form.value.firstname,
            birthdate: moment(this.form.value.birthdate).format('YYYY-MM-DD'),
            isActive: this.form.value.isActive
        }
        return crew
    }

    private getRecord(id: number): Promise<any> {
        const promise = new Promise((resolve) => {
            this.crewService.getSingle(id).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                this.goBack()
            })
        })
        return promise
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, array: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
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

    private populateDropDowns(): void {
        this.populateDropDown(this.shipService, 'ships', 'shipDropdown', 'ship', 'description').then(() => {
            this.populateDropDown(this.nationalityService, 'nationalities', 'nationalityDropdown', 'nationality', 'description').then(() => {
                this.populateDropDown(this.genderService, 'genders', 'genderDropdown', 'gender', 'description')
            })
        })
    }

    private populateFields(result: CrewReadVM): void {
        this.form.setValue({
            id: result.id,
            lastname: result.lastname,
            firstname: result.firstname,
            birthdate: result.birthdate,
            ship: { 'id': result.ship.id, 'description': result.ship.description },
            nationality: { 'id': result.nationality.id, 'description': result.nationality.description },
            gender: { 'id': result.gender.id, 'description': result.gender.description },
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(crew: CrewWriteVM): void {
        if (crew.id === 0) {
            this.crewService.add(crew).pipe(indicate(this.isLoading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        } else {
            this.crewService.update(crew.id, crew).pipe(indicate(this.isLoading)).subscribe(() => {
                this.resetForm()
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }
    }

    private setLocale() {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.getLabel('header'))
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
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
