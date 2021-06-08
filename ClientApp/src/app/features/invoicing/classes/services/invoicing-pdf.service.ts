import { Injectable } from '@angular/core'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// Custom
import { InvoicingViewModel } from '../view-models/invoicing-view-model'
import { IsTransferGroupViewModel } from '../view-models/isTransferGroup-view-model'

@Injectable({ providedIn: 'root' })

export class InvoicingPdfService {

    public doInvoiceTasks(invoice: InvoicingViewModel): void {

        const dd = {
            pageMargins: [30, 40, 30, 50],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 7 },
            content: [
                [
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
                    font: 'Roboto'
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

    private isTransferGroupTotal(data: IsTransferGroupViewModel): any {
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

    private buildIsTransferGroupTotal(data: IsTransferGroupViewModel): void {
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

}
