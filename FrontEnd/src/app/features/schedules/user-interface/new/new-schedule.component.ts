import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { map, startWith } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DestinationDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/destination-dropdown-resource'
import { DestinationService } from 'src/app/features/destinations/classes/destination.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { PortDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/port-dropdown-resource'
import { PortService } from 'src/app/features/ports/classes/services/port.service'
import { Router } from '@angular/router'
import { ScheduleService } from '../../classes/calendar/schedule.service'
import { ScheduleWriteResource } from '../../classes/form/schedule-write-resource'
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

    private feature = 'scheduleCreateForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private url = '/schedules'
    private windowTitle = 'Schedule'
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    private daysToDelete = []
    private daysToInsert = []
    private scheduleWriteResource: ScheduleWriteResource[] = []
    public selectedWeekDays = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    public filteredDestinations: Observable<DestinationDropdownResource[]>
    public filteredPorts: Observable<PortDropdownResource[]>

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private portService: PortService, private router: Router, private scheduleService: ScheduleService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.populateDropDown(this.destinationService, 'destinations', 'filteredDestinations', 'destination', 'description')
        this.populateDropDown(this.portService, 'ports', 'filteredPorts', 'port', 'description')
        this.getLocale()
    }

    ngOnDestroy(): void {
        this.unsubscribe()
        this.unlisten()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.warning(), 'warningColor', this.messageSnackbarService.askConfirmationToAbortEditing(), ['abort', 'ok']).subscribe(response => {
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

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGetWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public onGoBack(): void {
        this.router.navigate([this.url])
    }

    public onSave(): void {
        this.buildScheduleObjectsToDelete()
        this.scheduleService.deleteRange(this.scheduleWriteResource).subscribe(() => {
            this.buildScheduleObjectsToCreate()
            this.scheduleService.addRange(this.scheduleWriteResource).subscribe(() => {
                this.resetForm()
                this.onGoBack()
                this.showSnackbar(this.messageSnackbarService.recordCreated(), 'info')
            }, errorCode => {
                this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
            })
        }, errorCode => {
            this.showSnackbar(this.messageSnackbarService.filterError(errorCode), 'error')
        })
    }

    public onToggleItem(item: string, lookupArray: string[]): void {
        this.toggleActiveItem(item, lookupArray)
        this.createDaysToInsert()
    }

    public onUpdateArrays(): void {
        this.createPeriodToDelete()
        this.createDaysToInsert()
    }

    public dropdownFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
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

    private buildScheduleObjectsToCreate(): any {
        this.scheduleWriteResource = []
        this.form.value.daysToInsert.forEach((day: any) => {
            this.scheduleWriteResource.push({
                'date': day,
                'destinationId': this.form.value.destination.id,
                'portId': this.form.value.port.id,
                'maxPersons': this.form.value.maxPersons,
                'isActive': true,
                'userId': this.helperService.readItem('userId')
            })
        })
    }

    private buildScheduleObjectsToDelete(): void {
        this.scheduleWriteResource = []
        this.daysToDelete.forEach((day: string) => {
            this.scheduleWriteResource.push({
                'date': day.substring(4, day.length),
                'portId': this.form.value.port.id,
                'destinationId': this.form.value.destination.id,
                'maxPersons': 0,
                'isActive': false,
                'userId': this.helperService.readItem('userId')
            })
        })
    }

    private createDaysToInsert(): void {
        this.daysToInsert = []
        this.selectedWeekDays.forEach(weekday => {
            this.daysToDelete.forEach((day: string) => {
                if (day.substring(0, 3) == weekday) {
                    this.daysToInsert.push(day.substr(4, 10))
                }
            })
        })
        this.form.patchValue({
            daysToInsert: this.daysToInsert
        })
    }

    private createPeriod(from: moment.MomentInput, to: moment.MomentInput): any {
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
            this.daysToDelete = this.createPeriod(new Date(this.fromDate.value.format('YYYY-MM-DD')), new Date(this.toDate.value.format('YYYY-MM-DD')))
            this.form.patchValue({
                periodToDelete: this.daysToDelete
            })
        }
    }

    private filterArray(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem('language'))
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
            maxPersons: [0, [Validators.required, Validators.min(1), Validators.max(999)]],
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

    private resetForm(): void {
        this.form.reset()
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private toggleActiveItem(item: string, lookupArray: string[]): void {
        const element = document.getElementById(item)
        if (element.classList.contains('active-item')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('active-item')
                    break
                }
            }
        } else {
            element.classList.add('active-item')
            lookupArray.push(item)
        }
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
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

    get maxPersons(): AbstractControl {
        return this.form.get('maxPersons')
    }

    //#endregion

}
