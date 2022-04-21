import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { Injectable } from '@angular/core'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// Custom
import { InvoicingTransferGroupVM } from '../view-models/invoicing-transfer-group-vm'
import { InvoicingVM } from '../view-models/invoicing-vm'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'

@Injectable({ providedIn: 'root' })

export class InvoicingPdfService {


    constructor(private logoService: LogoService) { }

    public doInvoiceTasks(invoice: InvoicingVM): void {
        console.log('Processing...', invoice)
        const dd = {
            pageMargins: [50, 50, 50, 50],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 7 },
            content: [
                [
                    this.addHeaders(invoice[0]),
                    this.reservations(invoice[0].reservations,
                        ['destination', 'ship', 'ticketNo', 'hasTransfer', 'adults', 'kids', 'free', 'totalPersons', 'remarks'],
                        ['left', 'left', 'center', 'center', 'right', 'right', 'right', 'right', 'left']),
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

    private buildHasTransferGroupHeaders(): any[] {
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

    private portGroup(data, columns: any[], align: any[]): any {
        return {
            table: {
                widths: [40, 30, 30, 30, 30],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildHasTransferGroup(data, columns, align),
                heights: 10,
                bold: false,
            },
            margin: [192, 40, 10, 10]
        }
    }

    private hasTransferGroup(data, columns: any[], align: any[]): any {
        return {
            table: {
                widths: [40, 30, 30, 30, 30],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildHasTransferGroup(data, columns, align),
                heights: 10,
                bold: false,
            },
            margin: [192, 40, 10, 10]
        }
    }

    private buildReservations(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.buildReservationsHeader())
        data.forEach((row: any) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private buildHasTransferGroup(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.buildHasTransferGroupHeaders())
        data.forEach((row: any) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private hasTransferGroupTotal(data: InvoicingTransferGroupVM): any {
        return {
            table: {
                widths: [40, 30, 30, 30, 30],
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildHasTransferGroupTotal(data),
                heights: 10,
                bold: false,
            },
            margin: [192, 0, 10, 10]
        }
    }

    private buildHasTransferGroupTotal(data: InvoicingTransferGroupVM): void {
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
                    // text: this.convertBoolToString(row[element].toString()),
                    text: row[element],
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
                                { text: '\n\nDate: ' + data.date, alignment: 'right', fontSize: 9 },
                                { text: '\nCustomer: ' + data.customer.description, alignment: 'right', fontSize: 9 },
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