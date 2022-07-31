import { Injectable } from '@angular/core'
import { jsPDF } from 'jspdf'
// Fonts
import 'src/assets/fonts/ACCanterBold.js'
import 'src/assets/fonts/NotoSansMonoCondensedRegular.js'
import 'src/assets/fonts/PFHandbookProThin.js'
// Custom

import { InvoicingVM } from '../view-models/invoicing-vm'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { environment } from 'src/environments/environment'
import { HelperService } from 'src/app/shared/services/helper.service'

@Injectable({ providedIn: 'root' })

export class InvoicingPDFService {

    //#region variables

    private topMargin = 20
    private lineGap = 4
    private pageCount: number
    private nextLineTop = this.topMargin
    private pageHeight = 0
    private pdf = new jsPDF()
    private customer: InvoicingVM

    //#endregion

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(record: any): void {
        this.init(record)
        this.addLogo(this.pdf)
        this.addTitle(this.pdf)
        this.addCriteria(this.pdf, record)
        this.addPortGroup(this.pdf)
        this.addBody(this.pdf)
        this.addFooter(this.pageCount, this.pdf, true)
        this.openPdf()
    }

    //#endregion

    //#region private methods

    private addCriteria(pdf: jsPDF, record: any): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(9)
        const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
        pdf.text('Period: ' + this.helperService.formatISODateToLocale(criteria.fromDate) + ' - ' + this.helperService.formatISODateToLocale(criteria.toDate), 286, 12, { align: 'right' })
        pdf.text('Customer: ' + record.customer.description, 286, 16, { align: 'right' })
    }

    private addPortGroup(pdf: jsPDF): void {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        this.nextLineTop += this.lineGap + 12
        pdf.text('Adults', 62, this.nextLineTop, { align: 'right' })
        pdf.text('Kids', 72, this.nextLineTop, { align: 'right' })
        pdf.text('Free', 82, this.nextLineTop, { align: 'right' })
        pdf.text('Total', 93, this.nextLineTop, { align: 'right' })
        pdf.text('Actual', 106, this.nextLineTop, { align: 'right' })
        pdf.text('Transfer', 111, this.nextLineTop, { align: 'left' })
        this.nextLineTop += this.lineGap
        for (let portGroupIndex = 0; portGroupIndex < this.customer.portGroup.length; portGroupIndex++) {
            for (let hasTransferGroupIndex = 0; hasTransferGroupIndex < this.customer.portGroup[portGroupIndex].hasTransferGroup.length; hasTransferGroupIndex++) {
                pdf.text(this.buildTransferGroupLine(pdf, portGroupIndex, hasTransferGroupIndex), 57, this.nextLineTop)
                this.nextLineTop += this.lineGap
            }
            pdf.text(this.buildPortGroupLine(pdf, portGroupIndex), 30, this.nextLineTop)
            this.nextLineTop += this.lineGap
        }
    }

    private addBody(pdf: jsPDF): void {
        this.nextLineTop += this.lineGap + 5
        pdf.text('Destination', 10, this.nextLineTop, { align: 'left' })
        pdf.text('Port', 44, this.nextLineTop, { align: 'left' })
        pdf.text('Ship', 71, this.nextLineTop, { align: 'left' })
        pdf.text('Ticket No', 94, this.nextLineTop, { align: 'left' })
        pdf.text('Adults', 132, this.nextLineTop, { align: 'right' })
        pdf.text('Kids', 141, this.nextLineTop, { align: 'right' })
        pdf.text('Free', 151, this.nextLineTop, { align: 'right' })
        pdf.text('Total', 162, this.nextLineTop, { align: 'right' })
        pdf.text('Actual', 174, this.nextLineTop, { align: 'right' })
        pdf.text('N/S', 184, this.nextLineTop, { align: 'right' })
        pdf.text('Transfer', 188, this.nextLineTop, { align: 'left' })
        pdf.text('Remarks', 204, this.nextLineTop, { align: 'left' })
        pdf.text('RefNo', 279, this.nextLineTop, { align: 'left' })
        this.nextLineTop += this.lineGap
        for (let reservationIndex = 0; reservationIndex < this.customer.reservations.length; reservationIndex++) {
            if (this.mustAddPage(this.nextLineTop + this.topMargin, this.pageHeight)) {
                this.addFooter(this.pageCount, pdf, false)
                this.pageCount++
                this.nextLineTop = this.addPageAndResetTopMargin(pdf)
            }
            pdf.text(this.buildReservationLine(pdf, reservationIndex), 10, this.nextLineTop)
            this.nextLineTop += this.lineGap
        }
    }

    private addFooter(pageCount: number, pdf: jsPDF, isLastPage: boolean): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(9)
        pdf.text('Page: ' + pageCount.toString() + this.isLastPage(isLastPage), 286, 200, { align: 'right' })
    }

    private addLogo(pdf: jsPDF): void {
        pdf.addImage(this.logoService.getLogo(), 'JPEG', 10, 10, 15, 15)
        pdf.setFont('ACCanterBold')
        pdf.setFontSize(20)
        pdf.setTextColor(173, 0, 0)
        pdf.text(environment.appName, 30, 18)
    }

    private addPageAndResetTopMargin(pdf: jsPDF): number {
        pdf.addPage()
        this.topMargin = 10
        return this.topMargin
    }

    private addTitle(pdf: jsPDF): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Billing Report', 36, 22)
    }

    private buildReservationLine(pdf: jsPDF, index: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.reservations[index].destination.padEnd(20, ' ').substring(0, 20) + '   ' +
            this.customer.reservations[index].port.padEnd(15, ' ') + '   ' +
            this.customer.reservations[index].ship.padEnd(12, ' ') + '   ' +
            this.customer.reservations[index].ticketNo.substring(0, 18).padEnd(20, ' ') + '   ' +
            this.customer.reservations[index].adults.toString().padStart(3, ' ') + '   ' +
            this.customer.reservations[index].kids.toString().padStart(3, ' ') + '   ' +
            this.customer.reservations[index].free.toString().padStart(3, ' ') + '   ' +
            this.customer.reservations[index].totalPersons.toString().padStart(5, ' ') + '   ' +
            this.customer.reservations[index].embarkedPassengers.toString().padStart(4, ' ') + '   ' +
            this.customer.reservations[index].totalNoShow.toString().padStart(4, ' ') + '   ' +
            this.formatTransfer(this.customer.reservations[index].hasTransfer) + '  ' +
            this.customer.reservations[index].remarks.substring(0, 49).padEnd(49, ' ') + ' ' +
            this.customer.reservations[index].refNo.toString()
        return line
    }

    private buildPortGroupLine(pdf: jsPDF, index: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.portGroup[index].port.padEnd(17, ' ') + ' ' +
            this.customer.portGroup[index].adults.toString().padStart(3, ' ') + '   ' +
            this.customer.portGroup[index].kids.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[index].free.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[index].totalPersons.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[index].totalPassengers.toString().padStart(6, ' ') + '   '
        return line
    }

    private buildTransferGroupLine(pdf: jsPDF, x: number, z: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.portGroup[x].hasTransferGroup[z].adults.toString().padStart(3, ' ') + '   ' +
            this.customer.portGroup[x].hasTransferGroup[z].kids.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[x].hasTransferGroup[z].free.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[x].hasTransferGroup[z].totalPersons.toString().padStart(4, ' ') + '   ' +
            this.customer.portGroup[x].hasTransferGroup[z].totalPassengers.toString().padStart(6, ' ') + '   ' +
            this.formatTransfer(this.customer.portGroup[x].hasTransferGroup[z].hasTransfer) + '   '
        return line

    }

    private formatTransfer(hasTransfer: any): string {
        return hasTransfer ? 'YES      ' : 'NO       '
    }

    private init(record: any): void {
        this.customer = Object.assign([], record)
        this.nextLineTop = 20
        this.pageCount = 1
        this.pdf = new jsPDF('landscape', 'mm', 'a4')
        this.pageHeight = parseInt(this.pdf.internal.pageSize.height.toFixed())
    }

    private isLastPage(isLastPage: boolean): string {
        return isLastPage ? ' Last page' : ''
    }

    private mustAddPage(nextLineTop: number, pageHeight: number): boolean {
        if (nextLineTop > pageHeight) {
            return true
        }
    }

    private openPdf(): void {
        this.pdf.output('dataurlnewwindow')
    }

    //#endregion

}
