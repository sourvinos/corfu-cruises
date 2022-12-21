import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'year-selector',
    templateUrl: './year-selector.component.html',
    styleUrls: ['./year-selector.component.css']
})

export class YearSelectorComponent {

    //#region variables

    @Input() public activeYear: number
    @Output() public yearEmitter = new EventEmitter()

    public years: string[] = []

    //#endregion

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateYears()
    }

    //#endregion

    //#region public methods

    public getIcon(filename: string): string {
        return environment.calendarIconDirectory + filename + '.svg'
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public selectYear(year: string): any {
        this.yearEmitter.emit(year)
    }

    //#endregion

    //#region private methods

    private populateYears(): void {
        for (let year = 2022; year < 2028; year++) {
            this.years.push(year.toString())
        }
    }

    //#endregion

}
