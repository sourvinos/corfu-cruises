import moment from 'moment'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
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
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PortDropdownVM } from 'src/app/features/ports/classes/view-models/port-dropdown-vm'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { ScheduleDeleteVM } from './../../classes/form/schedule-delete-vm'
import { ScheduleService } from '../../classes/services/schedule.service'
import { ScheduleWriteVM } from '../../classes/form/schedule-write-vm'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'new-schedule',
    templateUrl: './new-schedule.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './new-schedule.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class NewScheduleComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'scheduleCreateForm'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/schedules'
    public isLoading = new Subject<boolean>()

    public isAutoCompleteDisabled = true
    public destinations: DestinationDropdownVM[]
    public filteredDestinations: Observable<DestinationDropdownVM[]>
    public ports: PortDropdownVM[]
    public filteredPorts: Observable<PortDropdownVM[]>

    private periodToDelete = []
    private daysToInsert = []
    public selectedWeekDays = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private scheduleService: ScheduleService, private snackbarService: SnackbarService, private titleService: Title) { }

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

    public getWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public onSave(): void {
        this.saveRecord()
    }

    public onToggleItem(item: string, lookupArray: string[]): void {
        this.toggleActiveItem(item, lookupArray)
        this.createDaysToInsert()
    }

    public onUpdateArrays(): void {
        this.createPeriodToDelete()
        this.createDaysToInsert()
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

    private buildScheduleToCreate(): ScheduleWriteVM[] {
        const formValue = this.form.value
        const objects: ScheduleWriteVM[] = []
        this.form.value.daysToInsert.forEach((day: any) => {
            const x: ScheduleWriteVM = {
                id: formValue.id,
                destinationId: formValue.destination.id,
                portId: formValue.port.id,
                date: day,
                maxPassengers: formValue.maxPassengers,
                departureTime: formValue.departureTime,
                isActive: true
            }
            objects.push(x)
        })
        return objects
    }

    private buildObjectsToDelete(): ScheduleDeleteVM[] {
        const formValue = this.form.value
        const objects: ScheduleDeleteVM[] = []
        this.periodToDelete.forEach((day: string) => {
            const x = {
                destinationId: formValue.destination.id,
                portId: formValue.port.id,
                date: day.substring(4)
            }
            objects.push(x)
        })
        return objects
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private createDaysToInsert(): void {
        this.daysToInsert = []
        this.selectedWeekDays.forEach(weekday => {
            this.periodToDelete.forEach((day: string) => {
                if (day.substring(0, 3) == weekday) {
                    this.daysToInsert.push(day.substring(4))
                }
            })
        })
        this.form.patchValue({
            daysToInsert: this.daysToInsert
        })
    }

    private createPeriodToInsert(from: moment.MomentInput, to: moment.MomentInput): any {
        const dateArray = []
        let currentDate = moment(from)
        const stopDate = moment(to)
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('ddd YYYY-MM-DD'))
            currentDate = moment(currentDate).add(1, 'days')
        }
        return dateArray
    }

    private createPeriodToDelete(): void {
        if (this.fromDate.value && this.toDate.value) {
            this.periodToDelete = this.createPeriodToInsert(new Date(this.fromDate.value.format('YYYY-MM-DD')), new Date(this.toDate.value.format('YYYY-MM-DD')))
            this.form.patchValue({
                periodToDelete: this.periodToDelete
            })
        }
    }

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            periodToDelete: [''],
            daysToInsert: ['', Validators.required],
            maxPassengers: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            departureTime: ['', [Validators.required, ValidationService.isTime]],
            isActive: true
        })
    }

    private populateDropDown(service: any, table: any, filteredTable: string, formField: string, modelProperty: string): Promise<any> {
        const promise = new Promise((resolve) => {
            service.getActive().toPromise().then(
                (response: any) => {
                    this[table] = response
                    resolve(this[table])
                    this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterArray(table, modelProperty, value)))
                }, (errorFromInterceptor: number) => {
                    this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
                })
        })
        return promise
    }

    private populateDropdowns(): void {
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(): void {
        this.scheduleService.deleteRange(this.buildObjectsToDelete()).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.scheduleService.addRange(this.buildScheduleToCreate()).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.resetForm()
                        this.goBack()
                        this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
                    },
                    error: (errorFromInterceptor) => {
                        this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
                    }
                })
            },
            error: (errorFromInterceptor) => {
                this.showSnackbar(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error')
            }
        })
    }

    private setLocale(): void {
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

    private toggleActiveItem(item: string, lookupArray: string[]): void {
        const element = document.getElementById(item)
        if (element.classList.contains('active-selectable-day')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('active-selectable-day')
                    break
                }
            }
        } else {
            element.classList.add('active-selectable-day')
            lookupArray.push(item)
        }
    }

    //#endregion

    //#region getters

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get fromDate(): AbstractControl {
        return this.form.get('fromDate')
    }

    get toDate(): AbstractControl {
        return this.form.get('toDate')
    }

    get maxPassengers(): AbstractControl {
        return this.form.get('maxPassengers')
    }

    get departureTime(): AbstractControl {
        return this.form.get('departureTime')
    }

    //#endregion

}
