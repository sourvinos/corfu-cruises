import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CustomerService } from '../classes/services/customer.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { ListResolved } from '../../../shared/classes/list-resolved'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CustomerListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    private url = 'customers'
    public feature = 'customerList'
    public icon = 'home'
    public parentUrl = '/'

    public records = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private customerService: CustomerService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.addShortcuts()
    }

    ngAfterViewInit(): void {
        this.changeScrollWheelSpeed()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public editRecord(id: number): void {
        this.router.navigate([this.url, id])
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.router.navigate([this.url + '/new'])
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private changeScrollWheelSpeed(): void {
        this.helperService.changeScrollWheelSpeed(document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport'))
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error == null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    //#endregion

}
