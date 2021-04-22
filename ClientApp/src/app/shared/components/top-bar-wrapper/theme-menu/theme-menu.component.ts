import { Component, HostListener, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { HelperService } from 'src/app/shared/services/helper.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'theme-menu',
    templateUrl: './theme-menu.component.html',
    styleUrls: ['./theme-menu.component.css']
})

export class ThemeMenuComponent {

    //#region variables

    private feature = 'theme-menu'
    public defaultTheme = 'dark'

    //#endregion

    constructor(@Inject(DOCUMENT) private document: Document, private helperService: HelperService, private messageLabelService: MessageLabelService) { }

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

    public onChangeTheme(theme: string): void {
        this.changeTheme(theme)
        this.attachStylesheetToHead()
        this.updateLocalStorage()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGetTheme(): string {
        return this.helperService.readItem("theme") == '' ? this.onSaveTheme(this.defaultTheme) : this.helperService.readItem("theme")
    }

    public onHideMenu(): void {
        const menu = (<HTMLElement>document.getElementById('hamburger-menu')); menu.classList.remove('visible')
        const nav = (<HTMLElement>document.getElementById('secondary-menu')); nav.classList.remove('visible')
    }

    //#endregion

    //#region private methods

    private applyTheme(): void {
        this.updateVariables()
        this.attachStylesheetToHead()
        this.updateLocalStorage()
    }

    private attachStylesheetToHead(): void {
        const headElement = this.document.getElementsByTagName('head')[0]
        const newLinkElement = this.document.createElement('link')
        newLinkElement.rel = 'stylesheet'
        newLinkElement.href = this.defaultTheme + '.css'
        headElement.appendChild(newLinkElement)
    }

    private changeTheme(theme: string): void {
        this.defaultTheme = theme
    }

    private updateLocalStorage(): void {
        this.helperService.saveItem('theme', this.defaultTheme)
    }

    private updateVariables(): void {
        this.defaultTheme = this.helperService.readItem('theme') || this.defaultTheme
    }

    public onSaveTheme(theme: string): string {
        this.helperService.saveItem('theme', theme)
        return theme
    }

    //#endregion

}
