import { Injectable } from '@angular/core'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingPortVM } from '../view-models/invoicing-port-vm'
import { InvoicingReservationVM } from '../view-models/invoicing-reservation-vm'
import { InvoicingVM } from '../view-models/invoicing-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from '../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strPFHandbookPro } from '../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class InvoicingPDFService {

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(record: InvoicingVM): void {
        this.setFonts()
        const dd = {
            background: this.setBackgroundImage(),
            info: this.setPageInfo(),
            pageOrientation: 'landscape',
            pageSize: 'A4',
            content: [
                {
                    margin: [-10, 0, 0, 20],
                    columns: [
                        this.setLogo(),
                        this.setTitle(),
                        this.setCriteria(record)
                    ]
                },
                {
                    table: {
                        body: this.createPortGroup(record.portGroup)
                    },
                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        body: this.createReservationLines(record.reservations)
                    },
                },
            ],
            styles: {
                AkaAcidCanterBold: {
                    font: 'AkaAcidCanterBold',
                }, PFHandbookPro: {
                    font: 'PFHandbookPro',
                }
            },
            defaultStyle: {
                font: 'PFHandbookPro',
            },
            footer: (currentPage: { toString: () => string }, pageCount: string) => {
                return this.setFooter(currentPage, pageCount)
            }
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private createPortGroup(portGroup: InvoicingPortVM[]): any {
        const rows = []
        rows.push([
            { text: 'Adults', fontSize: 6 },
            { text: 'Kids', fontSize: 6 },
            { text: 'Free', fontSize: 6 },
            { text: 'Total', fontSize: 6 },
            { text: 'Actual', fontSize: 6 },
            { text: 'N/S', fontSize: 6 },
            { text: 'Transfer', fontSize: 6 }
        ])
        for (const transfer of portGroup) {
            for (const port of transfer.hasTransferGroup) {
                rows.push([
                    { text: port.adults, alignment: 'right', fontSize: 5 },
                    { text: port.kids, alignment: 'right', fontSize: 5 },
                    { text: port.free, alignment: 'right', fontSize: 5 },
                    { text: port.totalPersons, alignment: 'right', fontSize: 5 },
                    { text: port.totalPassengers, alignment: 'right', fontSize: 5 },
                    { text: port.totalPersons - port.totalPassengers, alignment: 'right', fontSize: 5 },
                    { text: port.hasTransfer, alignment: 'left', fontSize: 5 },
                ])
            }
        }
        return rows
    }

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['PFHandbookPro'] = strPFHandbookPro
        pdfMake.fonts = {
            PFHandbookPro: {
                normal: 'PFHandbookPro',
            },
            AkaAcidCanterBold: {
                normal: 'AkaAcidCanterBold'
            }
        }
    }

    private setBackgroundImage(): any[] {
        const backgroundImage = [
            {
                image: this.logoService.getLogo('light'),
                width: '1000',
                opacity: 0.03
            }
        ]
        return backgroundImage
    }

    private setPageInfo(): any {
        const pageInfo = {
            title: 'Billing Report',
            filename: 'Boos.pdf'
        }
        return pageInfo
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
                { text: 'Billing Report', alignment: 'left', color: '#22a7f2', fontSize: 10, margin: [-4, 0, 0, 0] }
            ]
        }
        return title
    }

    private setCriteria(record: InvoicingVM): any {
        const fromDate = this.helperService.formatISODateToLocale(record.fromDate)
        const toDate = this.helperService.formatISODateToLocale(record.toDate)
        const criteria = {
            type: 'none',
            ul: [
                { text: 'Date range: ' + fromDate + ' - ' + toDate, alignment: 'right', color: '#0a5f91', fontSize: 8 },
                { text: 'Customer: ' + record.customer.description, alignment: 'right', color: '#0a5f91', fontSize: 8 }
            ]
        }
        return criteria
    }

    private setFooter(currentPage: { toString: any }, pageCount: string): any {
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

    private createReservationLines(reservations: InvoicingReservationVM[]): any[] {
        const rows = []
        rows.push([
            { text: 'Date', fontSize: 6 },
            { text: 'Destination', fontSize: 6 },
            { text: 'Ship', fontSize: 6 },
            { text: 'Port', fontSize: 6 },
            { text: 'RefNo', fontSize: 6 },
            { text: 'TicketNo', fontSize: 6 },
            { text: 'Transfer', fontSize: 6 },
            { text: 'Adults', fontSize: 6 },
            { text: 'Kids', fontSize: 6 },
            { text: 'Free', fontSize: 6 },
            { text: 'Total', fontSize: 6 },
            { text: 'Actual', fontSize: 6 },
            { text: 'N/S', fontSize: 6 },
            { text: 'Remarks', fontSize: 6 },
        ])
        for (const reservation of reservations) {
            rows.push([
                { text: reservation.date, alignment: 'left', fontSize: 5 },
                { text: reservation.destination, alignment: 'left', fontSize: 5 },
                { text: reservation.ship, alignment: 'left', fontSize: 5 },
                { text: reservation.port, alignment: 'left', fontSize: 5 },
                { text: reservation.refNo, alignment: 'left', fontSize: 5 },
                { text: reservation.ticketNo, alignment: 'left', fontSize: 5 },
                { text: reservation.hasTransfer, alignment: 'left', fontSize: 5 },
                { text: reservation.adults, alignment: 'right', fontSize: 5 },
                { text: reservation.kids, alignment: 'right', fontSize: 5 },
                { text: reservation.free, alignment: 'right', fontSize: 5 },
                { text: reservation.totalPersons, alignment: 'right', fontSize: 5 },
                { text: reservation.embarkedPassengers, alignment: 'right', fontSize: 5 },
                { text: reservation.totalNoShow, alignment: 'right', fontSize: 5 },
                { text: reservation.remarks, alignment: 'left', fontSize: 5 },
            ])
        }
        return rows
    }

    //#endregion

}
