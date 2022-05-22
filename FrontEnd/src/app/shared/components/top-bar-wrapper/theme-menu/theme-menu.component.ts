import { Component, HostListener, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'

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

    constructor(@Inject(DOCUMENT) private document: Document, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService) { }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.applyTheme(this.localStorageService.getItem('theme') ? this.localStorageService.getItem('theme') : 'blue')
    }

    //#endregion

    //#region public methods

    public changeTheme(theme: string): void {
        this.applyTheme(theme)
        this.updateLocalStorage()
    }

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

    private applyTheme(theme: string): void {
        this.setSelectedTheme(theme)
        this.attachStylesheetToHead()
    }

    private attachStylesheetToHead(): void {
        const headElement = this.document.getElementsByTagName('head')[0]
        const newLinkElement = this.document.createElement('link')
        newLinkElement.rel = 'stylesheet'
        newLinkElement.href = this.defaultTheme + '.css'
        headElement.appendChild(newLinkElement)
    }

    private setSelectedTheme(theme: string): void {
        this.defaultTheme = theme
    }

    private updateLocalStorage(): void {
        this.localStorageService.saveItem('theme', this.defaultTheme)
    }

    //#endregion

}