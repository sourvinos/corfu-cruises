import { Component, HostListener, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'theme-menu',
    templateUrl: './theme-menu.component.html',
    styleUrls: ['./theme-menu.component.css']
})

export class ThemeMenuComponent {

    //#region variables

    private feature = 'theme'
    public defaultTheme = 'blue'

    //#endregion

    constructor(@Inject(DOCUMENT) private document: Document, private messageLabelService: MessageLabelService) { }

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.applyTheme()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getSelectedThemeIcon(): string {
        return this.defaultTheme
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    //#endregion

    //#region private methods

    private applyTheme(): void {
        this.setSelectedTheme()
        this.attachStylesheetToHead()
    }

    private attachStylesheetToHead(): void {
        const headElement = this.document.getElementsByTagName('head')[0]
        const newLinkElement = this.document.createElement('link')
        newLinkElement.rel = 'stylesheet'
        newLinkElement.href = this.defaultTheme + '.css'
        headElement.appendChild(newLinkElement)
    }

    private setSelectedTheme(): void {
        this.defaultTheme = 'blue'
    }

    //#endregion

}