import { Injectable } from '@angular/core'
import { jsPDF } from 'jspdf'
// Fonts
import 'src/assets/fonts/ACCanterBold.js'
import 'src/assets/fonts/NotoSansMonoCondensedRegular.js'
import 'src/assets/fonts/PFHandbookProThin.js'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { environment } from 'src/environments/environment'
import { InvoicingVM } from '../view-models/invoicing-vm'

@Injectable({ providedIn: 'root' })

export class InvoicingPDFService {

    //#region variables

    private topMargin = 20
    private lineGap = 4
    private pageCount: number
    private nextLineTop = this.topMargin
    private pageHeight = 0
    private pdf = new jsPDF()
    private criteria: any
    private customer: InvoicingVM

    //#endregion

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(record: any): void {
        console.log('PDF', record)
        console.log('Process:', this.customer)
        this.init(record)
        // this.addLogo(this.pdf)
        // this.addTitle(this.pdf)
        // this.addCriteria(this.pdf)
        this.addPortGroup(this.pdf)
        this.addBody(this.pdf)
        // this.addFooter(this.pageCount, this.pdf, true)
        this.openPdf()
    }


    //#endregion
    //#region private methods

    private addCriteria(pdf: jsPDF): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(9)
        pdf.text('Date: ' + this.helperService.formatISODateToLocale(this.criteria.date, true), 202, 12.5, { align: 'right' })
        pdf.text('Destination: ' + this.criteria.destination.description, 202, 16.5, { align: 'right' })
        pdf.text('Port: ' + this.criteria.port.description, 202, 20.5, { align: 'right' })
        pdf.text('Ship: ' + this.criteria.ship, 202, 24.5, { align: 'right' })
    }

    private addPortGroup(pdf: jsPDF): void {
        this.nextLineTop += this.lineGap + 12
        for (let portGroupIndex = 0; portGroupIndex < this.customer.portGroup.length; portGroupIndex++) {
            for (let hasTransferGroupIndex = 0; hasTransferGroupIndex < this.customer.portGroup[portGroupIndex].hasTransferGroup.length; hasTransferGroupIndex++) {
                pdf.text(this.buildTransferGroupLine(pdf, portGroupIndex, hasTransferGroupIndex), 30, this.nextLineTop)
                this.nextLineTop += this.lineGap
            }
            pdf.text(this.buildPortGroupLine(pdf, portGroupIndex), 30, this.nextLineTop)
            this.nextLineTop += this.lineGap
        }
    }

    private addBody(pdf: jsPDF): void {
        this.nextLineTop += this.lineGap + 12
        for (let reservationIndex = 0; reservationIndex < this.customer.reservations.length; reservationIndex++) {
            // if (this.mustAddPage(this.nextLineTop + this.topMargin, this.pageHeight)) {
            // this.addFooter(this.pageCount, pdf, false)
            // this.pageCount++
            // this.nextLineTop = this.addPageAndResetTopMargin(pdf)
            // }
            pdf.text(this.buildReservationLine(pdf, reservationIndex), 10, this.nextLineTop)
            this.nextLineTop += this.lineGap
        }
    }

    private addFooter(pageCount: number, pdf: jsPDF, isLastPage: boolean): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(9)
        pdf.text('Page: ' + pageCount.toString() + this.isLastPage(isLastPage), 202, 290, { align: 'right' })
    }

    private addLogo(pdf: jsPDF): void {
        pdf.addImage(this.logoService.getLogo(), 'JPEG', 10.3, 10, 15, 15)
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
        pdf.text('Embarkation Report', 31.5, 22)
    }

    // private buildPassengerLine(pdf: jsPDF, reservationIndex: number, passengeIndex: number): string {
    //     pdf.setFont('NotoSansMonoCondensedRegular')
    //     pdf.setFontSize(7)
    //     pdf.setTextColor(22, 111, 164)
    //     const passenger =
    //         this.records[reservationIndex].passengers[passengeIndex].lastname.padEnd(30, ' ') + ' ' +
    //         this.records[reservationIndex].passengers[passengeIndex].firstname.padEnd(20, ' ') + ' ' +
    //         this.records[reservationIndex].passengers[passengeIndex].nationalityDescription.padEnd(30, ' ')
    //     return passenger
    // }

    private buildReservationLine(pdf: jsPDF, index: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.reservations[index].destination.padEnd(20, ' ') + ' ◽ ' +
            this.customer.reservations[index].port.padEnd(15, ' ') + ' ◽ ' +
            this.customer.reservations[index].ship.padEnd(12, ' ') + ' ◽ ' +
            this.customer.reservations[index].ticketNo.padEnd(20, ' ') + ' ◽ ' +
            this.customer.reservations[index].adults.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].kids.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].free.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].totalPersons.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].embarkedPassengers.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].totalNoShow.toString().padStart(3, ' ') + ' ◽ ' +
            this.customer.reservations[index].hasTransfer + ' ◽ ' +
            this.customer.reservations[index].remarks.padEnd(11, ' ')
        return line
    }

    private buildPortGroupLine(pdf: jsPDF, index: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.portGroup[index].adults.toString().padStart(3, ' ') + ' ◽ '
        return line
    }

    private buildTransferGroupLine(pdf: jsPDF, x: number, z: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.customer.portGroup[x].hasTransferGroup[z].adults.toString().padStart(3, ' ') + ' ◽ '
        return line

    }

    // private getCustomer(index: number): string {
    //     return this.records[index].customer.substring(0, 10)
    // }

    // private getDriver(index: number): string {
    //     return this.records[index].driver == undefined ? '(EMPTY)' : this.records[index].driver.substring(0, 10)
    // }

    // private getPlusMinusIcon(index: number): string {
    //     return this.records[index].totalPersons > this.records[index].passengers.length ? '!' : ''
    // }

    // private getRemarks(index: number): string {
    //     return this.records[index].remarks.substring(0, 50)
    // }

    private init(record: any): void {
        this.customer = Object.assign([], record)
        this.nextLineTop = 20
        this.pageCount = 1
        this.pdf = new jsPDF('landscape', 'mm', 'a4')
        this.pageHeight = parseInt(this.pdf.internal.pageSize.height.toFixed())
        // this.populateCriteriaFromStoredVariables(ship)
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

    private populateCriteriaFromStoredVariables(ship: any): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.criteria = {
                'date': criteria.date,
                'destination': criteria.destination,
                'port': criteria.port,
                'ship': ship
            }
        }
    }

    //#endregion

}
