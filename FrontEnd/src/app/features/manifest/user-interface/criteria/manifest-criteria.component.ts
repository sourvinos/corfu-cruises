import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { MatCalendar } from '@angular/material/datepicker'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PortActiveVM } from './../../../ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'manifest-criteria',
    templateUrl: './manifest-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './manifest-criteria.component.css']
})

export class ManifestCriteriaComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'manifestCriteria'
    public featureIcon = 'manifest'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = null

    private criteria: any
    public destinations: DestinationActiveVM[] = []
    public ports: PortActiveVM[] = []
    public selectedDate = new Date()
    public ships: ShipActiveVM[] = []

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateFieldsFromStoredVariables()
        this.setSelectedDate()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoToday(): void {
        this.selectedDate = new Date()
        this.form.patchValue({ date: this.selectedDate.toISOString().substring(0, 10) })
        this.calendar._goToDateInView(this.selectedDate, 'month')
    }

    /**
     * @param portId 
     * @returns True or false so that the checkbox can be checked or left empty
     */
    public lookupPort(portId: number): boolean {
        if (this.criteria) {
            return this.criteria.ports.filter((port: any) => port.id == portId).length != 0 ? true : false
        }
    }

    /**
     * Adds/removes controls to/from the formArray
     * @param event 
     * @param description 
     */
    public onCheckboxChange(event: any, description: string): void {
        const selectedPorts = this.form.controls['ports'] as FormArray
        if (event.target.checked) {
            selectedPorts.push(this.formBuilder.group({
                id: [parseInt(event.target.value), Validators.required],
                description: [description]
            }))
        } else {
            const index = selectedPorts.controls.findIndex(x => x.value.id == parseInt(event.target.value))
            selectedPorts.removeAt(index)
        }
    }

    public onDoTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public selectDate(selected: Date): void {
        this.form.patchValue({
            date: this.dateHelperService.formatDateToIso(selected, false)
        })
    }

    /**
     * Clears all radio buttons for the selected group and checks only the selected
     * @param classname The radio group
     * @param id The selected item id
     * @param description The selected description
     */
    public updateRadioButtons(classname: any, id: any, description: any): void {
        const radios = document.getElementsByClassName(classname) as HTMLCollectionOf<HTMLInputElement>
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = false
        }
        const radio = document.getElementById(classname + id) as HTMLInputElement
        radio.checked = true
        this.form.patchValue({
            [classname]: {
                'description': description
            }
        })
    }

    //#endregion

    //#region private methods

    /**
     * Adds all the stored ports from the localstorage to the form.
     * Called on every page load (when called from the menu or when returning from the manifest list)
     */
    private addPortsFromStorage(): void {
        const selectedPorts = this.form.controls['ports'] as FormArray
        this.criteria.ports.forEach((port: any) => {
            selectedPorts.push(new FormControl({
                'id': port.id,
                'description': port.description
            }))
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required, ValidationService.RequireDate]],
            destination: this.formBuilder.group({
                id: ['', [Validators.required]],
                description: []
            }),
            ports: this.formBuilder.array([], Validators.required),
            ship: this.formBuilder.group({
                id: ['', [Validators.required]],
                description: []
            })
        })
    }

    private navigateToList(): void {
        this.router.navigate(['manifest/list'])
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
        this.populateDropdownFromLocalStorage('ports')
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.form.patchValue({
                date: this.criteria.date,
                destination: {
                    'id': this.criteria.destination.id,
                    'description': this.criteria.destination.description
                },
                ports: this.addPortsFromStorage(),
                ship: {
                    'id': this.criteria.ship.id,
                    'description': this.criteria.ship.description
                }
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    /**
     * Sets the selected date either today or whatever is stored
     */
    private setSelectedDate(): void {
        if (this.criteria != undefined) {
            this.selectedDate = new Date(this.criteria.date)
        } else {
            this.selectedDate = new Date()
            this.form.patchValue({
                date: this.dateHelperService.formatDateToIso(this.selectedDate, false)
            })
        }
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

}
