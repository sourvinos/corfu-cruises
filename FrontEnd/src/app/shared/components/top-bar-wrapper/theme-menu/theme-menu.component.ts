import { Component, HostListener, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
// Custom
import { LocalStorageService } from './../../../services/local-storage.service'
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

    constructor(@Inject(DOCUMENT) private document: Document, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService) { }

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

    public changeTheme(theme: string): void {
        this.setDefaultTheme(theme)
        this.attachStylesheetToHead()
        this.saveSelectedTheme()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getTheme(): string {
        return this.localStorageService.getItem('theme') == '' ? this.onSaveTheme(this.defaultTheme) : this.localStorageService.getItem('theme')
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
        this.saveSelectedTheme()
    }

    private attachStylesheetToHead(): void {
        const headElement = this.document.getElementsByTagName('head')[0]
        const newLinkElement = this.document.createElement('link')
        newLinkElement.rel = 'stylesheet'
        newLinkElement.href = this.defaultTheme + '.css'
        headElement.appendChild(newLinkElement)
    }

    private setDefaultTheme(theme: string): void {
        this.defaultTheme = theme
    }

    private saveSelectedTheme(): void {
        this.localStorageService.saveItem('theme', this.defaultTheme)
    }

    private setSelectedTheme(): void {
        this.defaultTheme = this.localStorageService.getItem('theme') || this.defaultTheme
    }

    public onSaveTheme(theme: string): string {
        this.localStorageService.saveItem('theme', theme)
        return theme
    }

    //#endregion

}