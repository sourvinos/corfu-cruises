import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import moment from 'moment'
import { Subject } from 'rxjs'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { DateAdapter } from '@angular/material/core'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { BookingFlat } from '../../classes/booking-flat'

@Component({
    selector: 'booking-wrapper',
    templateUrl: './booking-wrapper.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './booking-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BookingWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Reservations'
    public feature = 'bookingWrapper'

    //#endregion

    //#region particular variables

    private dateInISO = ''
    public dateIn = ''
    public form: FormGroup
    public records: string[] = []
    public bookingsFlat: BookingFlat[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
    }

    ngAfterViewInit(): void {
        this.focus('dateIn')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
        this.removeSelectedIdsFromLocalStorage()
    }

    //#endregion

    //#region public methods

    public onGetHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onLoadBookings(): void {
        this.clearSelectedArraysFromLocalStorage()
        if (this.checkValidDate()) {
            this.updateLocalStorageWithDate()
            this.navigateToList()
        }
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private checkValidDate(): boolean {
        const date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (moment(moment(date, 'DD/MM/YYYY')).isValid()) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        } else {
            this.dateInISO = ''
            return false
        }
    }

    private clearSelectedArraysFromLocalStorage(): void {
        localStorage.removeItem('bookings')
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            dateIn: ['2021-05-19', [Validators.required]]
        })
    }

    private navigateToList(): void {
        this.router.navigate(['date/', this.dateInISO], { relativeTo: this.activatedRoute })
    }

    private removeSelectedIdsFromLocalStorage(): void {
        localStorage.removeItem('selectedIds')
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private updateLocalStorageWithDate(): void {
        this.helperService.saveItem('date', this.dateInISO)
    }

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('dateIn')
    }

    //#endregion    

}
