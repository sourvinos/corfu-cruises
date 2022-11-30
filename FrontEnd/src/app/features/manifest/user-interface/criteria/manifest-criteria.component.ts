import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'
import { Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'manifest-criteria',
    templateUrl: './manifest-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './manifest-criteria.component.css']
})

export class ManifestCriteriaComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'manifestCriteria'
    public featureIcon = ''
    public form: FormGroup
    public icon = 'home'
    public input: InputTabStopDirective
    public parentUrl = '/'

    public isAutoCompleteDisabled = true
    public destinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public ships: ShipActiveVM[] = []

    //#endregion

    constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        // this.populateFieldsFromStoredVariables()
        this.setLocale()
        this.subscribeToInteractionService()
        this.focusOnField()
    }

    // ngOnDestroy(): void {
    //     this.cleanup()
    //     this.unlisten()
    // }

    //#endregion

    //#region public methods

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public checkForEmptyAutoComplete(event: { target: { value: any } }): void {
        if (event.target.value == '') this.isAutoCompleteDisabled = true
    }

    public enableOrDisableAutoComplete(event: any): void {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onCheckboxChange(event: any, controlName: string): void {
        const selectedItems = (this.form.controls[controlName] as FormArray)
        if (event.target.checked) {
            selectedItems.push(new FormControl(event.target.value))
        } else {
            const index = selectedItems.controls.findIndex(x => x.value === event.target.value)
            selectedItems.removeAt(index)
        }
    }

    public onDoTasks(): void {
        this.storeCriteria()
        // this.navigateToList()
    }

    public updateField(type: string, event: MatDatepickerInputEvent<Date>): void {
        this.form.patchValue({ date: this.dateHelperService.formatDateToIso(new Date(event.value != null ? event.value : ''), false) })
    }

    //#endregion

    //#region private methods

    // private cleanup(): void {
    //     this.unsubscribe.next()
    //     this.unsubscribe.unsubscribe()
    // }

    private focusOnField(): void {
        this.helperService.focusOnField('date')
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required, ValidationService.RequireDate]],
            destinationId: ['', [Validators.required]],
            portIds: this.formBuilder.array([], [Validators.required]),
            shipId: ['', [Validators.required]]
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ports')
        this.populateDropdownFromLocalStorage('ships')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.form.setValue({
                date: criteria.date,
                destinationId: criteria.destinationId,
                port: criteria.port,
                ship: criteria.ship
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('manifest-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destinationId(): AbstractControl {
        return this.form.get('destinationId')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get shipId(): AbstractControl {
        return this.form.get('shipId')
    }

    //#endregion

}
