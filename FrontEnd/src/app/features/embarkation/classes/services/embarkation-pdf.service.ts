import { Injectable } from '@angular/core'
import { jsPDF } from 'jspdf'
// Fonts
import 'src/assets/fonts/ACCanterBold.js'
import 'src/assets/fonts/NotoSansMonoCondensedRegular.js'
import 'src/assets/fonts/PFHandbookProThin.js'
// Custom
import { EmbarkationReservationVM } from '../view-models/embarkation-reservation-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { environment } from 'src/environments/environment'
import { HelperService } from 'src/app/shared/services/helper.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationPDFService {

    //#region variables

    private topMargin = 20
    private lineGap = 4
    private pageCount: number
    private nextLineTop = this.topMargin
    private pageHeight = 0
    private pdf = new jsPDF()
    private criteria: any
    private records: EmbarkationReservationVM[]

    //#endregion

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(ship: string, records: EmbarkationReservationVM[]): void {
        this.init(ship, records)
        this.addLogo(this.pdf)
        this.addTitle(this.pdf)
        this.addCriteria(this.pdf)
        this.addBody(this.pdf)
        this.addFooter(this.pageCount, this.pdf, true)
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

    private addBody(pdf: jsPDF): void {
        this.nextLineTop += this.lineGap + 12
        for (let reservationIndex = 0; reservationIndex < this.records.length; reservationIndex++) {
            if (this.mustAddPage(this.nextLineTop + this.topMargin, this.pageHeight)) {
                this.addFooter(this.pageCount, pdf, false)
                this.pageCount++
                this.nextLineTop = this.addPageAndResetTopMargin(pdf)
            }
            pdf.text(this.buildReservationLine(pdf, reservationIndex), 10, this.nextLineTop)
            for (let passengerIndex = 0; passengerIndex < this.records[reservationIndex].passengers.length; passengerIndex++) {
                this.nextLineTop += this.lineGap
                if (this.mustAddPage(this.nextLineTop + this.topMargin, this.pageHeight)) {
                    this.addFooter(this.pageCount, pdf, false)
                    this.pageCount++
                    this.nextLineTop = this.addPageAndResetTopMargin(pdf)
                }
                pdf.text(this.buildPassengerLine(pdf, reservationIndex, passengerIndex), 20, this.nextLineTop)
            }
            this.nextLineTop += this.lineGap
        }
    }

    private addFooter(pageCount: number, pdf: jsPDF, isLastPage: boolean): void {
        pdf.setFont('PFHandbookProThin')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(9)
        console.log(isLastPage)
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

    private buildPassengerLine(pdf: jsPDF, reservationIndex: number, passengeIndex: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(7)
        pdf.setTextColor(22, 111, 164)
        const passenger =
            this.records[reservationIndex].passengers[passengeIndex].lastname.padEnd(30, ' ') + ' ' +
            this.records[reservationIndex].passengers[passengeIndex].firstname.padEnd(20, ' ') + ' ' +
            this.records[reservationIndex].passengers[passengeIndex].nationalityDescription.padEnd(30, ' ')
        return passenger
    }

    private buildReservationLine(pdf: jsPDF, index: number): string {
        pdf.setFont('NotoSansMonoCondensedRegular')
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const line =
            this.records[index].refNo.padEnd(11, ' ') + ' ◽ ' +
            this.records[index].ticketNo.padEnd(30, ' ') + ' ◽ ' +
            this.getCustomer(index).padEnd(10, ' ') + ' ◽ ' +
            this.getDriver(index).padEnd(10, ' ') + ' ◽ ' +
            this.records[index].totalPersons.toString().padStart(3, ' ') + ' ◽ ' +
            this.getRemarks(index)
        return line
    }

    private getCustomer(index: number): string {
        return this.records[index].customer.substring(0, 10)
    }

    private getDriver(index: number): string {
        return this.records[index].driver == undefined ? '(EMPTY)' : this.records[index].driver.substring(0, 10)
    }

    private getRemarks(index: number): string {
        return this.records[index].remarks.substring(0, 50)
    }

    private init(ship: string, records: EmbarkationReservationVM[]): void {
        this.records = records
        this.nextLineTop = 20
        this.pageCount = 1
        this.pdf = new jsPDF('p', 'mm', 'a4')
        this.pageHeight = parseInt(this.pdf.internal.pageSize.height.toFixed())
        this.populateCriteriaFromStoredVariables(ship)
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
