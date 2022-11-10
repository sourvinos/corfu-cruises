import { Injectable } from '@angular/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { InvoicingPortVM } from '../view-models/invoicing-port-vm'
import { InvoicingVM } from '../view-models/invoicing-vm'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from 'src/assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strPFHandbookPro } from 'src/assets/fonts/PF-Handbook-Pro.Base64.encoded'
import { strUbuntuCondensed } from 'src/assets/fonts/UbuntuCondensed.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class InvoicingPDFService {

    constructor(private dateHelperService: DateHelperService, private logoService: LogoService) { }

    public createPDF(invoicing: InvoicingVM): void {
        this.setFonts()
        const dd = {
            background: this.setBackgroundImage(),
            info: this.setPageInfo(invoicing.customer.description),
            pageOrientation: 'landscape',
            pageSize: 'A4',
            content: [
                this.createHeaders(invoicing),
                this.createSummary(invoicing),
                this.createBody(invoicing)
            ],
            styles: {
                AkaAcidCanterBold: {
                    font: 'AkaAcidCanterBold',
                },
                PFHandbookPro: {
                    font: 'PFHandbookPro',
                },
                UbuntuCondensed: {
                    font: 'UbuntuCondensed',
                }
            },
            defaultStyle: {
                font: 'UbuntuCondensed',
                fontSize: 8
            },
            footer: (currentPage: { toString: () => string }, pageCount: string): void => {
                return this.createFooter(currentPage, pageCount)
            }
        }
        this.openPdf(dd)
    }

    //#region Headers

    private createHeaders(invoicing: InvoicingVM): any {
        const headers =
        {
            margin: [-10, 0, 0, 20],
            columns: [
                this.setLogo(),
                this.setTitle(),
                this.setCriteria(invoicing)
            ]
        }
        return headers
    }

    private setLogo(): any {
        const logo = {
            type: 'none',
            width: 60,
            margin: [0, -6, 0, 0],
            ul: [
                { image: this.logoService.getLogo('light'), fit: [40, 40], alignment: 'left' },
            ]
        }
        return logo
    }

    private setTitle(): any {
        const title = {
            type: 'none',
            ul: [
                { text: 'Corfu Cruises', alignment: 'left', color: '#0a5f91', fontSize: 20, margin: [-5, 0, 0, 0], style: 'AkaAcidCanterBold' },
                { text: 'Billing Report', alignment: 'left', color: '#22a7f2', fontSize: 12, margin: [-4, 0, 0, 0], style: 'PFHandbookPro' }
            ]
        }
        return title
    }

    private setCriteria(record: InvoicingVM): any {
        const fromDate = this.dateHelperService.formatISODateToLocale(record.fromDate)
        const toDate = this.dateHelperService.formatISODateToLocale(record.toDate)
        const criteria = {
            type: 'none',
            ul: [
                { text: 'Customer: ' + record.customer.description, alignment: 'right', color: '#0a5f91', fontSize: 11, style: 'PFHandbookPro' },
                { text: 'Date range: ' + fromDate + ' - ' + toDate, alignment: 'right', color: '#0a5f91', fontSize: 11, style: 'PFHandbookPro' }
            ]
        }
        return criteria
    }

    //#endregion

    //#region Summary

    private createSummary(invoicing: InvoicingVM): any {
        const columns = []
        invoicing.portGroup.forEach(x => {
            const portGroup = {
                layout: 'noBorders',
                table: {
                    body: [this.createPortHasTransferGroup(x)]
                }
            }
            columns.push(portGroup)
        })
        return columns
    }

    private createPortHasTransferGroup(element: InvoicingPortVM): any {
        const columns = []
        // Port description
        columns.push({
            table: {
                widths: [100],
                body: [
                    [[
                        { rowSpan: 2, text: '\n' + element.port },
                        { text: '' }
                    ]],
                ],
            },
            margin: [0, 0, 0, 0],
            layout: 'noBorders'
        })
        // Per port
        element.hasTransferGroup.forEach(x => {
            const hasTranferGroup = {
                table: {
                    widths: [20, 13, 13, 15, 20, 15, 33],
                    body: [
                        [{ text: 'Adults' }, { text: 'Kids' }, { text: 'Free' }, { text: 'Total' }, { text: 'Actual' }, { text: 'N/S' }, { text: 'Transfer', fillColor: '#eeffee', margin: [0, 0, 8, 0] }],
                        [{ text: x.adults, alignment: 'right' }, { text: x.kids, alignment: 'right' }, { text: x.free, alignment: 'right' }, { text: x.totalPersons, alignment: 'right' }, { text: x.totalPassengers, alignment: 'right' }, { text: x.totalPersons - x.totalPassengers, alignment: 'right' }, { text: x.hasTransfer ? 'Yes' : 'No', margin: [8, 0, 0, 0], fillColor: '#eeffee' }]
                    ]
                },
                margin: [this.calculateHasTransferLeftMargin(element.hasTransferGroup), 0, 0, 0],
                layout: 'lightHorizontalLines'
            }
            columns.push(hasTranferGroup)
        })
        // Port totals
        columns.push({
            table: {
                widths: [20, 13, 13, 17, 20, 15],
                body: [
                    [{ text: 'Adults' }, { text: 'Kids' }, { text: 'Free' }, { text: 'Total', margin: [0, 0, 2, 0] }, { text: 'Actual' }, { text: 'N/S' }],
                    [{ text: element.adults, alignment: 'right' }, { text: element.kids, alignment: 'right' }, { text: element.free, alignment: 'right' }, { text: element.totalPersons, alignment: 'right', margin: [0, 0, 2, 0] }, { text: element.totalPassengers, alignment: 'right' }, { text: element.totalPersons - element.totalPassengers, alignment: 'right' }]
                ]
            },
            margin: [this.calculatePortTotalsLeftMargin(element.hasTransferGroup), 0, 0, 0],
            layout: 'lightHorizontalLines'
        })
        return columns
    }

    private calculateHasTransferLeftMargin(x: string | any[]): number {
        if (x.length == 1) {
            return x[0].hasTransfer ? 0 : 233
        }
        if (x.length == 2) {
            return 0
        }
    }

    private calculatePortTotalsLeftMargin(x: string | any[]): number {
        if (x.length == 1) {
            return x[0].hasTransfer ? 233 : 0
        }
        if (x.length == 2) {
            return 0
        }
    }

    //#endregion

    //#region Body

    private createBody(invoicing: InvoicingVM): any {
        const body = {
            margin: [0, 10, 0, 0],
            table: {
                headerRows: 1,
                widths: [35, 'auto', 'auto', 'auto', 'auto', 'auto', 20, 20, 20, 20, 20, 20, 'auto', '*'],
                body: this.createReservationLines(invoicing)
            },
            layout: 'lightHorizontalLines'
        }
        return body
    }

    private createReservationLines(invoicing: InvoicingVM): any {
        const rows = []
        rows.push(this.createBodyHeader())
        invoicing.reservations.forEach(reservation => {
            rows.push([
                { text: this.dateHelperService.formatISODateToLocale(reservation.date), alignment: 'center' },
                { text: reservation.refNo },
                { text: reservation.ticketNo },
                { text: reservation.destination },
                { text: reservation.ship },
                { text: reservation.port },
                { text: reservation.adults, alignment: 'right' },
                { text: reservation.kids, alignment: 'right' },
                { text: reservation.free, alignment: 'right' },
                { text: reservation.totalPersons, alignment: 'right' },
                { text: reservation.embarkedPassengers, alignment: 'right' },
                { text: reservation.totalNoShow, alignment: 'right' },
                { text: reservation.hasTransfer ? 'Yes' : 'No', alignment: 'center' },
                { text: reservation.remarks },
            ])
        })
        rows.push(this.createBodyTotals(invoicing))
        return rows
    }

    private createBodyHeader(): any {
        return ([
            { text: 'Date' },
            { text: 'RefNo' },
            { text: 'TicketNo' },
            { text: 'Destination' },
            { text: 'Ship' },
            { text: 'Port' },
            { text: 'Adults', alignment: 'right' },
            { text: 'Kids', alignment: 'right' },
            { text: 'Free', alignment: 'right' },
            { text: 'Total', alignment: 'right' },
            { text: 'Actual', alignment: 'right' },
            { text: 'N/S', alignment: 'right' },
            { text: 'Transfer' },
            { text: 'Remarks' }
        ])
    }

    private createBodyTotals(reservations: InvoicingVM): any {
        return ([
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: this.calculateBodyTotals('adults', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: this.calculateBodyTotals('kids', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: this.calculateBodyTotals('free', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: this.calculateBodyTotals('totalPersons', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: this.calculateBodyTotals('totalPassengers', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: this.calculateBodyTotals('totalPersons', reservations) - this.calculateBodyTotals('totalPassengers', reservations), alignment: 'right', fontSize: 10, fillColor: '#deecf5' },
            { text: '' },
            { text: '' }
        ])
    }

    private calculateBodyTotals(personIdentifier: string, record: { portGroup: any[] }): number {
        let sum = 0
        record.portGroup.forEach(element => {
            sum += element[personIdentifier]
        })
        return sum
    }

    //#endregion

    //#region Footer

    private createFooter(currentPage: { toString: any }, pageCount: string): any {
        const footer = {
            layout: 'noBorders',
            margin: [0, 10, 40, 10],
            table: {
                widths: ['100%'],
                body: [
                    [
                        { text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', fontSize: 6 }
                    ]
                ]
            }
        }
        return footer
    }

    //#endregion

    //#region Misc

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['UbuntuCondensed'] = strUbuntuCondensed
        pdfFonts.pdfMake.vfs['PFHandbookPro'] = strPFHandbookPro
        pdfMake.fonts = {
            AkaAcidCanterBold: {
                normal: 'AkaAcidCanterBold'
            },
            PFHandbookPro: {
                normal: 'PFHandbookPro'
            },
            UbuntuCondensed: {
                normal: 'UbuntuCondensed',
            }
        }
    }

    private setBackgroundImage(): any[] {
        const backgroundImage = [
            {
                image: this.logoService.getLogo(),
                width: 1000,
                opacity: 0.03
            }
        ]
        return backgroundImage
    }

    private setPageInfo(customerDescription: string): any {
        const pageInfo = {
            title: 'Customer Billing for ' + customerDescription
        }
        return pageInfo
    }

    private openPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    //#endregion

}
