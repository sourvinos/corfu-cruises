import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import pdfMake from 'pdfmake/build/pdfmake'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { InvoicingViewModel } from '../view-models/invoicing-view-model'
import { ReservationsViewModel } from '../view-models/reservation-view-model'

@Injectable({ providedIn: 'root' })

export class InvoicingService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/invoicing')
    }

    getByDate(date: string): Observable<InvoicingViewModel> {
        return this.http.get<InvoicingViewModel>(this.url + '/date/' + date)
    }

    getByDateAndCustomer(date: string, customerId: number): Observable<InvoicingViewModel> {
        return this.http.get<InvoicingViewModel>(this.url + '/date/' + date + '/customer/' + customerId)
    }

    createInvoiceOnClient(invoice: InvoicingViewModel): void {
        const dd = {
            pageMargins: [130, 50, 130, 200],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 7 },
            content: [
                {
                    // table: {
                    //     headerRows: 1,
                    //     body: [
                    //         [{ text: 'Destination' }, { text: 'Ship' }, { text: 'Ticket No' }, { text: 'Transfer' }, { text: 'Adults' }, { text: 'Kids' }, { text: 'Free' }, { text: 'Total' }, { text: 'Remarks' }],
                    //         this.buildTableRows()
                    //     ]
                    // },
                    // layout: 'noBorders'
                    table: {
                        headerRows: 1,
                        body: [
                            { text: 'Destination' }, { text: 'Ship' }, { text: 'Ticket No' }, { text: 'Transfer' }, { text: 'Adults' }, { text: 'Kids' }, { text: 'Free' }, { text: 'Total' }, { text: 'Remarks' }
                        ]
                    },
                    layout: 'noBorders'
                },
                [
                    this.table(invoice[0].reservations,
                        ['destinationDescription', 'shipDescription', 'ticketNo', 'isTransfer', 'adults', 'kids', 'free', 'totalPersons', 'remarks'],
                        ['left', 'left', 'center', 'center', 'right', 'right', 'right', 'right', 'left'])
                ],
                {
                    table: {
                        body: [
                            { text: 'TRANSFER' }, { text: 'ADULTS' }, { text: 'KIDS' }, { text: 'FEEE' }, { text: 'TOTAL' }
                        ]
                    }
                }, [
                    this.tableTransferGroup(invoice[0].isTransferGroup,
                        ['isTransfer', 'adults', 'kids', 'free', 'totalPersons'],
                        ['center', 'right', 'right', 'right', 'right'])
                ],
                {
                    columns: [
                        {
                            width: 100,
                            text: 'HEY'
                        }, {
                            width: 100,
                            text: 'HEY YOU'
                        }
                    ]
                }
            ],
            styles: {
                table: {
                    fontSize: 7,
                    bold: false
                }
            }
        }
        this.createPdf(dd)
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'DESTINATION', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'SHIP', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'TICKET', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'TRANSFER', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ADULTS', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'KIDS', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'FREE', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'TOTAL', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'REMARKS', style: 'tableHeader', alignment: 'center', bold: true }
        ]
    }

    private createTransferGroupHeaders(): any[] {
        return [
            { text: 'TRANSFER', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ADULTS', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'KIDS', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'FREE', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'TOTAL', style: 'tableHeader', alignment: 'center', bold: true }
        ]
    }

    private table(data, columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, align),
                heights: 10,
                bold: false
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    private tableTransferGroup(data, columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildIsTransferGroup(data, columns, align),
                heights: 10,
                bold: false,
                style: 'table',
                layout: 'noBorders'
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    private buildTableBody(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.createTableHeaders())
        data.forEach((row) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private buildIsTransferGroup(data, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.createTransferGroupHeaders())
        data.forEach((row: ReservationsViewModel) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private processRow(columns: any[], row, dataRow: any[], align: any[]): any {
        console.log(columns)
        columns.forEach((element, index) => {
            dataRow.push({ text: row[element].toString(), alignment: align[index].toString(), color: '#000000', noWrap: false })
        })
        return dataRow
    }

}
