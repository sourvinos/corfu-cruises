import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { ManifestCriteriaVM } from '../../classes/view-models/manifest-criteria-vm'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestVM } from '../../classes/view-models/manifest-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { environment } from 'src/environments/environment'
import { OccupantActiveVM } from 'src/app/features/occupants/classes/view-models/occupant-active-vm'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css']
})

export class ManifestListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    private url = 'manifest'
    public feature = 'manifestList'
    public featureIcon = ''
    public icon = 'arrow_back'
    public parentUrl = '/manifest'

    public manifestCriteria: ManifestCriteriaVM

    public dropdownOccupants: OccupantActiveVM[] = []
    public crewCount = 0
    public passengerCount = 0
    public record: ManifestVM
    public filteredRecords: ManifestVM

    public occupants = []
    public genders = []
    public nationalities = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private dateHelperService: DateHelperService, private emojiService: EmojiService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: ManifestPdfService, private router: Router, private snackbarService: SnackbarService) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.populateDropdowns()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        // this.calculateTotals()
        // this.addCrewToPassengers()
        // this.populateCriteriaFromStoredVariables()
        // this.getDistinctGenders()
        // this.getDistinctNationalities()
        this.getDistinctOccupants()
        // this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        this.pdfService.createReport(this.record)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.filteredRecords.passengers = event.filteredValue
    }

    public formatDate(date: string, showWeekday = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    //#endregion

    //#region private methods

    private addCrewToPassengers(): void {
        if (this.record.passengers.length > 0) {
            this.record.ship.crew.forEach(crew => {
                this.record.passengers.push(crew)
            })
        }
    }

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            },
            'Alt.E': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'exportToPDF')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private calculateTotals(): void {
        this.passengerCount = this.record.passengers.length
        this.crewCount = this.record.ship ? this.record.ship.crew.length : 0
    }

    private getDistinctGenders(): void {
        let array = []
        array = [... new Set(this.record.passengers.map(x => x.genderDescription))]
        array.forEach(element => {
            this.genders.push({ label: element, value: element })
        })
    }

    private getDistinctNationalities(): void {
        let array = []
        array = [... new Set(this.record.passengers.map(x => x.nationalityDescription))]
        array.forEach(element => {
            this.nationalities.push({ label: element, value: element })
        })
    }

    private getDistinctOccupants(): void {
        let array = []
        array = [... new Set(this.record.passengers.map(x => x.occupantDescription))]
        array.forEach(element => {
            this.occupants.push({ label: element, value: element })
        })
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.record = listResolved.result[0]
            console.log(this.record.passengers)
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterResponse(listResolved.error), 'error')
        }
    }

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('manifest-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
            this.manifestCriteria = {
                date: criteria.date,
                destination: criteria.destination.description,
                port: criteria.port.description,
                ship: criteria.ship.description
            }
        }
    }

    private populateDropdowns(): void {
        this.dropdownOccupants = this.helperService.populateTableFiltersDropdowns(this.record.passengers, 'occupant')
    }


    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}