import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import moment from 'moment'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { environment } from 'src/environments/environment'
import { ScheduleResource } from '../../classes/schedule-resource'
import { ScheduleService } from '../../classes/schedule.service'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'schedule-create-form',
    templateUrl: './schedule-create-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './schedule-create-form.component.css']
})

export class ScheduleCreateFormComponent {

    //#region variables

    private feature = 'scheduleCreateForm'
    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Schedule'
    public environment = environment.production
    public form: FormGroup
    public input: InputTabStopDirective

    //#endregion

    //#region particular variables

    private daysToDelete = []
    private daysToInsert = []
    private schedulesResource: ScheduleResource[] = []
    public selectedWeekDays = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private messageCalendarService: MessageCalendarService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private scheduleService: ScheduleService, private snackbarService: SnackbarService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
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

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGetWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public onGoBack(): void {
        this.canDeactivate()
    }

    public onSave(): void {
        this.buildScheduleObjectsToDelete()
        this.scheduleService.deleteRange(this.schedulesResource).subscribe(() => {
            this.buildScheduleObjects()
            this.scheduleService.addRange(this.schedulesResource).subscribe(() => {
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

    private buildScheduleObjects(): any {
        this.schedulesResource = []
        this.form.value.daysToInsert.forEach((day: any) => {
            this.schedulesResource.push({
                'date': day,
                'portId': this.form.value.portId,
                'destinationId': this.form.value.destinationId,
                'maxPersons': this.form.value.maxPersons,
                'isActive': true,
                'userId': this.helperService.readItem('userId')
            })
        })
    }

    private buildScheduleObjectsToDelete(): void {
        this.schedulesResource = []
        this.daysToDelete.forEach((day: string) => {
            this.schedulesResource.push({
                'date': day.substring(4, day.length),
                'portId': this.form.value.portId,
                'destinationId': this.form.value.destinationId,
                'maxPersons': this.form.value.maxPersons,
                'isActive': true,
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

    private focus(field: string): void {
        this.helperService.setFocus(field)
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
            maxPersons: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            isActive: true,
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

    private toggleActiveItem(item: string, lookupArray: string[]): void {
        const element = document.getElementById(item)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item)
        }
    }

    private unsubscribe(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region getters

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
