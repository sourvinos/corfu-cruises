import { Component, Input, IterableDiffer, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core'
import { HelperService } from '../../services/helper.service'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { filter, take } from 'rxjs/operators'
import { fromEvent, Subscription } from 'rxjs'

import { IndexInteractionService } from 'src/app/shared/services/index-interaction.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageLabelService } from './../../services/messages-label.service'
import { MessageTableService } from '../../services/messages-table.service'

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.css']
})

export class CustomTableComponent {

    //#region variables

    @Input() feature: string
    @Input() fields: any
    @Input() headers: any
    @Input() justify: any
    @Input() records: any[]
    @Input() visibility: any
    @Input() widths: any
    @Input() types: any
    @Input() highlightFirstRow: boolean

    @ViewChild('contextMenu') contextMenu: TemplateRef<any>

    checkedIds: string[] = []
    currentRow = 0
    differences: IterableDiffer<any>;
    isColumnChecked = false
    overlayRef: OverlayRef | null
    randomTableId = Math.floor(Math.random() * 1000) + 1
    rowCount = 0
    rowHeight = 0
    sortColumn = ''
    sortOrder = ''
    subscription: Subscription
    table: any
    tableContainer: any
    totalPersons = 0

    //#endregion

    constructor(private helperService: HelperService, private indexInteractionService: IndexInteractionService, private interactionService: InteractionService, private messageLabelService: MessageLabelService, private messageTableService: MessageTableService, private overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        this.initVariables()
        this.getSortObject()
        this.sortTable(this.sortColumn, this.sortOrder)
        if (this.highlightFirstRow) {
            this.onGotoRow(1)
        }
    }

    //#endregion

    //#region public methods

    public onCheckKeyboard(event: any): void {
        switch (event.keyCode) {
            case 38: this.onGotoRow('Up'); break
            case 40: this.onGotoRow('Down'); break
            case 13: this.onSendRowToService(); break
            default: break
        }
    }

    public onEditRow(): void {
        this.onSendRowToService()
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGetRowMenu(id: string): string {
        return this.messageTableService.getDescription('table', id)
    }

    public onHeaderClick(field: string, _sortOrder: string, event: any): void {
        this.sortTable(field, _sortOrder, event)
        this.saveSortOrder(field, _sortOrder)
    }

    public onOpenContextMenu({ x, y }: MouseEvent, record: any): void {
        this.closeContextMenu()
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x, y })
            .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetX: 1 }])
        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        })
        this.overlayRef.attach(new TemplatePortal(this.contextMenu, this.viewContainerRef, {
            $implicit: record
        }))
        this.subscription = fromEvent<MouseEvent>(document, 'click').pipe(filter(event => {
            const clickTarget = event.target as HTMLElement
            return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget)
        }), take(1)).subscribe(() => {
            this.closeContextMenu()
        })
    }

    public onGotoRow(key: any): void {
        if (!isNaN(key)) {
            this.unselectAllRows().then(() => {
                this.selectRow(this.table, key)
                this.sendRowToIndexService()
            })
        }
        if (key === 'Up' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.table, 'up')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key === 'Down' && this.currentRow < this.records.length) {
            this.unselectRow()
            this.selectRow(this.table, 'down')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.randomTableId + '-' + this.currentRow.toString()).scrollIntoView({ block: 'end' })
            }
        }
    }

    public onSendRowToService(): void {
        this.closeContextMenu()
        if (document.getElementsByClassName('mat-dialog-container').length === 0) {
            this.interactionService.sendObject(this.records[this.currentRow - 1])
        } else {
            this.indexInteractionService.action(true)
        }
    }

    public onToggleCheckBox(row: number): void {
        this.checkedIds = []
        this.totalPersons = 0
        this.table.rows[row].classList.toggle('checked')
        this.table.querySelectorAll('tr.checked').forEach((element: { childNodes: { innerText: string }[] }) => {
            this.checkedIds.push(element.childNodes[1].innerText.trim())
            this.totalPersons += parseInt(element.childNodes[12].innerText, 10)
        })
        this.helperService.saveItem('selectedIds', JSON.stringify(this.checkedIds))
        this.interactionService.setCheckedTotalPersons(this.totalPersons)
    }

    //#endregion

    //#region private methods

    private closeContextMenu(): void {
        this.subscription && this.subscription.unsubscribe()
        if (this.overlayRef) {
            this.overlayRef.dispose()
            this.overlayRef = null
        }
    }

    private compareValues(key: string, order = 'asc'): any {
        return function innerSort(a: { [x: string]: any; hasOwnProperty: (arg0: string) => any }, b: { [x: string]: any; hasOwnProperty: (arg0: string) => any }): number {
            if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) { return 0 }
            let comparison = 0
            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]
            comparison = varA > varB ? 1 : -1
            return ((order === 'desc') ? (comparison * -1) : comparison)
        }
    }

    private focusOnHiddenInput(): void {
        setTimeout(() => {
            const element = document.getElementById('custom-table-input-' + this.randomTableId)
            if (typeof (element) != 'undefined' && element != null) {
                element.focus()
            }
        }, 500)
    }

    private getSortObject(): boolean {
        try {
            const sortObject = JSON.parse(this.helperService.readItem(this.feature))
            if (sortObject) {
                this.sortColumn = sortObject.columnName
                this.sortOrder = sortObject.sortOrder
                return true
            }
        } catch {
            return false
        }
    }

    private initVariables(): void {
        this.table = document.getElementById('custom-table-' + this.randomTableId)
        this.tableContainer = this.table.parentNode.parentNode
        this.rowHeight = 41
        this.rowCount = this.table.rows.length - 1
        document.getElementById('custom-table-input-' + this.randomTableId).style.zIndex = '-1'
        document.getElementById('custom-table-input-' + this.randomTableId).style.position = 'absolute'
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string): boolean {
        const rowOffsetTop = row.offsetTop
        const scrollTop = this.tableContainer.scrollTop
        const rowTopPlusHeight = rowOffsetTop + row.offsetHeight
        const indexTopPlusHeight = scrollTop + this.tableContainer.offsetHeight
        if (direction === 'Up') {
            if (indexTopPlusHeight - rowOffsetTop + this.rowHeight < this.tableContainer.offsetHeight) {
                return true
            } else {
                return false
            }
        }
        if (direction === 'Down') {
            if (rowTopPlusHeight <= indexTopPlusHeight) {
                return true
            } else {
                return false
            }
        }
    }

    private selectRow(table: HTMLTableElement, direction: any): void {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction, 10)
        } else {
            if (direction === 'up') { this.currentRow-- }
            if (direction === 'down') { ++this.currentRow }
        }
        this.focusOnHiddenInput()
        if (this.table.rows.length > 1)
            table.rows[this.currentRow].classList.add('selected')
    }

    private sendRowToIndexService(): void {
        this.indexInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    private saveSortOrder(columnName: string, sortOrder: string): void {
        this.helperService.saveItem(this.feature, JSON.stringify({ columnName, sortOrder }))
    }

    private sortTable(field: string, sortOrder: string, event?: any): void {
        if (event && event.toElement.cellIndex === 0) {
            this.isColumnChecked = !this.isColumnChecked
            this.checkedIds = []
            this.totalPersons = 0
            this.table.querySelectorAll('tbody tr').forEach((element: { classList: { add: (arg0: string) => void; remove: (arg0: string) => void }; childNodes: { innerText: string }[] }) => {
                if (this.isColumnChecked) {
                    element.classList.add('checked')
                    this.checkedIds.push(element.childNodes[1].innerText.trim())
                    this.totalPersons += parseInt(element.childNodes[12].innerText, 10)
                } else {
                    element.classList.remove('checked')
                }
            })
            this.helperService.saveItem('selectedIds', JSON.stringify(this.checkedIds))
            this.interactionService.setCheckedTotalPersons(this.totalPersons)
        } else {
            this.records.sort(this.compareValues(field, sortOrder))
            this.sortOrder = this.sortOrder == 'asc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc'
        }
    }

    private async unselectAllRows(): Promise<void> {
        await this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private unselectRow(): void {
        this.table.rows[this.currentRow].classList.remove('selected')
    }

    //#endregion

}
