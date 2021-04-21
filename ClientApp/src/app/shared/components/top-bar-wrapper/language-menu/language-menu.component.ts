import { Component, HostListener } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { MessageTableService } from 'src/app/shared/services/messages-table.service'

@Component({
    selector: 'language-menu',
    templateUrl: './language-menu.component.html',
    styleUrls: ['./language-menu.component.css']
})

export class LanguageMenuComponent {

    constructor(private dateAdapter: DateAdapter<any>, private helperService: HelperService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageMenuService: MessageMenuService, private messageSnackbarService: MessageSnackbarService, private messageTableService: MessageTableService, private messagelabelService: MessageLabelService) { }

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#region public methods

    public onGetLanguage(): string {
        return this.helperService.readItem("language") == '' ? this.onSaveLanguage('el-GR') : this.helperService.readItem("language")
    }

    public onHideMenu(): void {
        const checkbox = (<HTMLInputElement>document.getElementById('menu-btn'))
        checkbox.checked = false
    }

    public onSaveLanguage(language: string): string {
        this.helperService.saveItem('language', language)
        this.messageCalendarService.getMessages()
        this.messageHintService.getMessages()
        this.messageMenuService.getMessages()
        this.messageSnackbarService.getMessages()
        this.messageTableService.getMessages()
        this.messagelabelService.getMessages()
        this.messagelabelService.getMessages()
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
        return language
    }

    //#endregion

}
