import { Injectable } from '@angular/core'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// Custom
import { HelperService } from './../../../../shared/services/helper.service'
import { InvoicingTransferGroupViewModel } from '../view-models/invoicing-transfer-group-view-model'
import { InvoicingViewModel } from '../view-models/invoicing-view-model'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'

@Injectable({ providedIn: 'root' })

export class InvoicingPdfService {


    constructor(private logoService: LogoService, private helperService: HelperService) { }

    public doInvoiceTasks(invoice: InvoicingViewModel): void {
        const dd = {
            pageMargins: [50, 50, 50, 50],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 7 },
            content: [
                [
                    this.addHeaders(invoice[0]),
                    this.reservations(invoice[0].reservations,
                        ['destinationDescription', 'shipDescription', 'ticketNo', 'isTransfer', 'adults', 'kids', 'free', 'totalPersons', 'remarks'],
                        ['left', 'left', 'center', 'center', 'right', 'right', 'right', 'right', 'left']),
                    this.isTransferGroup(invoice[0].isTransferGroup,
                        ['isTransfer', 'adults', 'kids', 'free', 'totalPersons'],
                        ['center', 'right', 'right', 'right', 'right']),
                    this.isTransferGroupTotal(invoice[0].isTransferGroupTotal)
                ]
            ],
            styles: {
                table: {
                    fontSize: 7,
                    bold: false
                },
                tableHeader: {
                    alignment: 'center',
                    bold: false,
                    fillColor: '#eeeeee',
                    fontSize: 7,
                    margin: [0, 5, 0, 0],
                },
                defaultStyle: {
                    font: 'montserrat'
                }
            }
        }
        this.createPdf(dd)
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private buildReservationsHeader(): any[] {
        return [
            { text: 'DESTINATION', style: 'tableHeader' },
            { text: 'SHIP', style: 'tableHeader' },
            { text: 'TICKET', style: 'tableHeader' },
            { text: 'TRANSFER', style: 'tableHeader' },
            { text: 'ADULTS', style: 'tableHeader' },
            { text: 'KIDS', style: 'tableHeader' },
            { text: 'FREE', style: 'tableHeader' },
            { text: 'TOTAL', style: 'tableHeader' },
            { text: 'REMARKS', style: 'tableHeader' }
        ]
    }

    private buildIsTransferGroupHeaders(): any[] {
        return [
            { text: 'TRANSFER', style: 'tableHeader' },
            { text: 'ADULTS', style: 'tableHeader' },
            { text: 'KIDS', style: 'tableHeader' },
            { text: 'FREE', style: 'tableHeader' },
            { text: 'TOTAL', style: 'tableHeader' }
        ]
    }

    private reservations(data: any, columns: any[], align: any[]): any {
        return {
            table: {
                widths: [75, 60, 30, 40, 30, 30, 30, 30, '*'],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildReservations(data, columns, align),
                heights: 10,
                bold: false,
            },
        }
    }

    private isTransferGroup(data, columns: any[], align: any[]): any {
        return {
            table: {
                widths: [40, 30, 30, 30, 30],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildIsTransferGroup(data, columns, align),
                heights: 10,
                bold: false,
            },
            margin: [192, 40, 10, 10]
        }
    }

    private buildReservations(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.buildReservationsHeader())
        data.forEach((row) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private buildIsTransferGroup(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.buildIsTransferGroupHeaders())
        data.forEach((row: any) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private isTransferGroupTotal(data: InvoicingTransferGroupViewModel): any {
        return {
            table: {
                widths: [40, 30, 30, 30, 30],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildIsTransferGroupTotal(data),
                heights: 10,
                bold: false,
            },
            margin: [192, 0, 10, 10]
        }
    }

    private buildIsTransferGroupTotal(data: InvoicingTransferGroupViewModel): void {
        const body: any = []
        const dataRow = []
        dataRow.push({ alignment: 'center', text: 'TOTAL', margin: [0, 5, 0, 0] })
        dataRow.push({ alignment: 'right', text: data.adults, margin: [0, 5, 0, 0] })
        dataRow.push({ alignment: 'right', text: data.kids, margin: [0, 5, 0, 0] })
        dataRow.push({ alignment: 'right', text: data.free, margin: [0, 5, 0, 0] })
        dataRow.push({ alignment: 'right', text: data.totalPersons, margin: [0, 5, 0, 0] })
        body.push(dataRow)
        return body
    }

    private processRow(columns: any[], row: any, dataRow: any[], align: any[]): any {
        columns.forEach((element, index) => {
            dataRow.push(
                {
                    alignment: align[index].toString(),
                    color: '#000000',
                    noWrap: false,
                    text: this.convertBoolToString(row[element].toString()),
                    margin: [0, 5, 0, 0]
                })
        })
        return dataRow
    }

    private convertBoolToString(cell: any): string {
        switch (cell) {
            case 'true': return 'YES'
            case 'false': return 'NO'
            default: return cell
        }

    }

    private addHeaders(data: any): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                widths: ['30%', '70%'],
                body: [
                    [
                        { image: this.logoService.getLogo(), width: 80, height: 80, fit: [80, 80], },
                        {
                            text: [
                                { text: '\n\nDate: ' + this.helperService.formatDateToLocale(data.date), alignment: 'right', fontSize: 9 },
                                { text: '\nCustomer: ' + data.customerResource.description, alignment: 'right', fontSize: 9 },
                            ]
                        }
                    ],
                    [{ text: 'Trip Report', colSpan: 2, alignment: 'center', margin: [0, 10], fontSize: 18 }, {}],
                ]
            },
            layout: 'noBorders'
        }
    }

}