import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { ManifestViewModel } from '../../classes/view-models/manifest-view-model'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ManifestListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'manifestList'
    private windowTitle = 'Manifest'
    public feature = 'manifestList'

    //#endregion

    //#region particular variables

    public records: ManifestViewModel
    public highlightFirstRow = false

    //#endregion

    //#region table

    headers = ['', 'headerId', 'headerLastname', 'headerFirstname', 'headerDoB', 'headerIsCheckedIn', '']
    widths = ['0px', '0px', '50%', '25%', '10%', '10%', '56px']
    visibility = ['none', 'none', '', '', '', '', '']
    justify = ['center', 'left', 'left', 'left', 'center', 'center', 'center']
    types = ['', '', '', '', '', '', '']
    fields = ['', 'reservationId', 'lastname', 'firstname', 'doB', 'isCheckedIn', '']

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private helperService: HelperService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService, private titleService: Title) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.getLocale()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/manifest'])
    }


    //#endregion

    //#region private methods

    private getLocale(): void {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
            console.log('records', this.records)
            console.log('passengers', this.records[0].passengers)
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}