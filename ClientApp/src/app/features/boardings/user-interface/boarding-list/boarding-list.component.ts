import { BoardingViewModel } from './../../classes/boarding-view-model'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { BoardingService } from '../../classes/boarding.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'boarding-list',
    templateUrl: './boarding-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './boarding-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BoardingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'boardingList'
    private unlisten: Unlisten
    private windowTitle = 'Boarding'
    public feature = 'boardingList'

    //#endregion

    //#region particular variables

    public boardingStatus = '2'
    public filteredRecords: BoardingViewModel
    public form: FormGroup
    public records: BoardingViewModel
    public searchTerm: string

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private boardingService: BoardingService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initForm()
        this.addShortcuts()
        this.getLocale()
        this.setElementVisibility('hide')
    }

    ngAfterViewInit(): void {
        this.focus('date')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.setElementVisibility('show')
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onCheckRemarksLength(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public onDoBoarding(id: string): void {
        this.boardingService.boardPassenger(id).subscribe(() => {
            this.refreshSummary()
            this.showSnackbar(this.messageSnackbarService.recordUpdated(), 'info')
        })
    }

    public onFilterByBoardingStatus(): void {
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            const detail = record.details
            detail.forEach((element) => {
                if (!this.filteredRecords.boardings.find(({ ticketNo }) => ticketNo === record.ticketNo)) {
                    if (this.determineBoardingStatus(element.isCheckedIn) == this.boardingStatus || this.boardingStatus == '2') {
                        this.filteredRecords.boardings.push(record)
                    }
                }
            })
        })
    }

    public onFilterByLastname(query: string): void {
        this.boardingStatus = '2'
        this.searchTerm = query
        this.filteredRecords.boardings = []
        this.records.boardings.forEach((record) => {
            const detail = record.details
            detail.forEach((element: { lastname: string }) => {
                if (!this.filteredRecords.boardings.find(({ ticketNo }) => ticketNo === record.ticketNo)) {
                    if (element.lastname.toLowerCase().includes(query)) {
                        this.filteredRecords.boardings.push(record)
                    }
                }
            })
        })
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
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

    private determineBoardingStatus(status: boolean): string {
        switch (status) {
            case true: return '1'
            case false: return '0'
        }
    }

    private focus(field: string): void {
        this.helperService.setFocus(field)
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['2021-03-30', [Validators.required]]
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private refreshSummary(): void {
        this.interactionService.mustRefreshBoardingList()
    }

    private setElementVisibility(action: string): void {
        this.interactionService.setSidebarAndTopLogoVisibility(action)
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
