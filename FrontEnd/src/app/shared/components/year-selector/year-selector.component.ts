import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'year-selector',
    templateUrl: './year-selector.component.html',
    styleUrls: ['./year-selector.component.css']
})

export class YearSelectorComponent {

    @Input() public activeYear: number

    @Output() public yearEmitter = new EventEmitter()

    @ViewChild('yearOpener', { static: false }) yearOpener: ElementRef<HTMLInputElement>

    public years: string[]
    public imgIsLoaded = false
    // public isOpen = false

    ngOnInit(): void {
        this.populateMonths()
    }


    public getIcon(filename: string): string {
        return environment.calendarIconDirectory + filename + '.svg'
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    public selectYear(year: string): any {
        this.yearOpener.nativeElement.checked = false
        // this.isOpen = false
        this.yearEmitter.emit(year)
    }

    public setOpenerVisibility(visible: boolean): void {
        this.yearOpener.nativeElement.checked = visible
        // this.isOpen = !this.isOpen
    }

    public getOpenerVisibility(): boolean {
        return this.yearOpener != undefined ? this.yearOpener.nativeElement.checked : false
    }

    private populateMonths(): void {
        this.years = [
            '2021', '2022', '2023', '2024'
        ]
    }

}
