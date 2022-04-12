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
import { DestinationDropdownVM } from 'src/app/features/destinations/classes/view-models/destination-dropdown-vm'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PortDropdownVM } from 'src/app/features/ports/classes/view-models/port-dropdown-vm'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ScheduleReadVM } from '../../classes/form/schedule-read-vm'
import { ScheduleService } from '../../classes/services/schedule.service'
import { ScheduleWriteVM } from '../../classes/form/schedule-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'edit-schedule',
    templateUrl: './edit-schedule.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class EditScheduleComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'scheduleEditForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/schedules'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public destinations: DestinationDropdownVM[] = []
    public filteredDestinations: Observable<DestinationDropdownVM[]>
    public ports: PortDropdownVM[] = []
    public filteredPorts: Observable<PortDropdownVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private scheduleService: ScheduleService, private snackbarService: SnackbarService, private titleService: Title) {
        this.activatedRoute.params.subscribe(x => {
            x.id ? this.getRecord(x.id) : null
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropdowns()
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
                this.scheduleService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe(() => {
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

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ScheduleWriteVM {
        const schedule = {
            id: this.form.value.id,
            date: moment(this.form.value.date).format('YYYY-MM-DD'),
            destinationId: this.form.value.destination.id,
            portId: this.form.value.port.id,
            maxPassengers: this.form.value.maxPassengers,
            isActive: this.form.value.isActive
        }
        return schedule
    }

    private getRecord(id: number): Promise<any> {
        const promise = new Promise((resolve) => {
            this.scheduleService.getSingle(id).subscribe(result => {
                this.populateFields(result)
                resolve(result)
            }, errorFromInterceptor => {
                this.goBack()
                this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
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
            date: ['', [Validators.required, Validators.maxLength(10)]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            maxPassengers: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterError(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
    }

    private populateFields(result: ScheduleReadVM): void {
        this.form.setValue({
            id: result.id,
            date: moment(result.date).format('YYYY-MM-DD'),
            destination: { 'id': result.destination.id, 'description': result.destination.description },
            port: { 'id': result.port.id, 'description': result.port.description },
            maxPassengers: result.maxPassengers,
            isActive: result.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(schedule: ScheduleWriteVM): void {
        this.flattenForm()
        this.scheduleService.update(schedule.id, schedule).pipe(indicate(this.isLoading)).subscribe(() => {
            this.resetForm()
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
        })
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

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get maxPassengers(): AbstractControl {
        return this.form.get('maxPassengers')
    }

    //#endregion

}
