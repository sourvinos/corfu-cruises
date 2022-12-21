import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'month-selector',
    templateUrl: './month-selector.component.html',
    styleUrls: ['./month-selector.component.css']
})

export class MonthSelectorComponent {

    @Input() public baseColor: number
    @Input() public baseBrightness: number
    @Input() public brightnessStep: number

    @Output() public monthEmitter = new EventEmitter()

    @ViewChild('monthOpener', { static: false }) monthOpener: ElementRef<HTMLInputElement>

    public months: Month[] = []
    public imgIsLoaded = false
    public isOpen = false
    private baseOffset = -10
    private saturation = '50%'

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

    public selectMonth(month: number): any {
        this.monthEmitter.emit(month)
        this.monthOpener.nativeElement.checked = false
        this.isOpen = false
    }

    public setOpenerVisibility(): void {
        this.monthOpener.nativeElement.checked = !this.monthOpener.nativeElement.checked
        this.isOpen = !this.isOpen
    }

    private populateMonths(): void {
        this.months = [
            { 'id': 1, 'description': 'january', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 2, 'description': 'february', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 3, 'description': 'march', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 4, 'description': 'april', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 5, 'description': 'may', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 6, 'description': 'june', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 7, 'description': 'july', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 8, 'description': 'august', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 9, 'description': 'september', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 10, 'description': 'october', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 11, 'description': 'november', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
            { 'id': 12, 'description': 'december', 'offsetLeft': this.setOffsetLeft(), 'backgroundColor': this.setBrightness() },
        ]
    }

    public setBrightness(): string {
        return 'hsl(' + this.baseColor + ',' + this.saturation + ', ' + (this.baseBrightness += this.brightnessStep) + '%'
    }

    public setOffsetLeft(): string {
        return (this.baseOffset -= 38) + 'px'
    }

}

export interface Month {

    id: number
    description: string
    offsetLeft: string
    backgroundColor: string

}




