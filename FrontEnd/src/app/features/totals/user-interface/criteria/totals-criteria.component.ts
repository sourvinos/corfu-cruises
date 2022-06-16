import moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'totals-criteria',
    templateUrl: './totals-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './totals-criteria.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class TotalsCriteriaComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'totalsCriteria'
    public form: FormGroup
    public icon = 'home'
    public input: InputTabStopDirective
    public parentUrl = '/'

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.initForm()
        this.populateFieldsFromStoredVariables()
        this.setLocale()
        this.subscribeToInteractionService()
        this.setLocale()
    }

    ngDoCheck(): void {
        this.form.patchValue(
            {
                fromDate: moment(this.form.value.fromDate).utc(true).format('YYYY-MM-DD'),
                toDate: moment(this.form.value.toDate).utc(true).format('YYYY-MM-DD')
            }
        )
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
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

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required]
        })
    }

    private navigateToList(): void {
        this.router.navigate(['fromDate', this.form.value.fromDate, 'toDate', this.form.value.toDate], { relativeTo: this.activatedRoute })
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('totals-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('totals-criteria'))
            this.form.setValue({
                fromDate: criteria.fromDate,
                toDate: criteria.toDate
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('totals-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get fromDate(): AbstractControl {
        return this.form.get('fromDate')
    }

    get toDate(): AbstractControl {
        return this.form.get('toDate')
    }

    //#endregion    

}
