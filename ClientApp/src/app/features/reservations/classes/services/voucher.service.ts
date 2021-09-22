import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { LogoService } from './logo.service'
import { VoucherViewModel } from '../view-models/voucher/voucher-view-model'

@Injectable({ providedIn: 'root' })

export class VoucherService extends DataService {

    constructor(http: HttpClient, private logoService: LogoService) {
        super(http, '/api/voucher')
    }

    //#region public methods

    public createVoucherOnClient(voucher: VoucherViewModel): void {
        const rows = []
        rows.push([{ text: '' }, { text: '' }])
        rows.push([{ text: 'Passengers', colSpan: 2, alignment: 'center', fontSize: 18 }])
        for (const passenger of voucher.passengers) {
            rows.push([{ text: passenger.lastname, style: 'paddingLeft' }, { text: passenger.firstname }])
        }
        const dd = {
            pageMargins: [130, 50, 130, 200],
            content: [
                {
                    table: {
                        body: [
                            [{ image: this.logoService.getLogo(), fit: [120, 120], alignment: 'center' }]
                        ],
                        widths: ['100%'],
                        heights: 130,
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Dear guest,', alignment: 'center' }],
                            [{ text: 'Your reservation for', alignment: 'center' }],
                            [{ text: voucher.destinationDescription, alignment: 'center', fontSize: 20 }],
                            [{ text: 'is confirmed!', alignment: 'center' }]
                        ],
                        widths: ['100%'],
                        heights: [20, 10, 20, 30],
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        headerRows: 0,
                        body: [
                            [{ text: '' }, { text: '' }],
                            [{ text: 'Pickup details', colSpan: 2, alignment: 'center', fontSize: 18 }],
                            [{ text: 'Date', style: 'paddingLeft' }, { text: voucher.date }],
                            [{ text: 'Pickup point', style: 'paddingLeft' }, { text: voucher.pickupPointDescription }],
                            [{ text: 'Exact point', style: 'paddingLeft' }, { text: voucher.pickupPointExactPoint }],
                            [{ text: 'Time', style: 'paddingLeft' }, { text: voucher.pickupPointTime }],
                            [{ text: 'Remarks', style: 'paddingLeft' }, { text: voucher.remarks }],
                        ],
                        widths: ['50%', '50%'],
                        heights: [0, 20, 15, 15, 15, 15],
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    table: {
                        headerRows: 0,
                        body: rows,
                        widths: ['50%', '50%']
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    table: {
                        headerRows: 0,
                        body: [
                            [{ text: '' }],
                            [{ text: 'Number of passengers: ' + voucher.passengers.length, alignment: 'center', style: 'paddingTop' }]
                        ],
                        widths: '100%'
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            footer: {
                stack: [{
                    columns: [
                        { width: '*', text: '' },
                        {
                            width: 'auto',
                            table: {
                                body: [
                                    [{ qr: voucher.qr, width: 200 }]
                                ],
                                heights: 130
                            },
                            layout: 'noBorders'
                        },
                        { width: '*', text: '' }
                    ]
                },
                { text: environment.emailFooter.lineA, alignment: 'center', style: ['small'] },
                { text: environment.emailFooter.lineB, alignment: 'center', style: ['small'] },
                { text: environment.emailFooter.lineC, alignment: 'center', style: ['small'] }
                ]
            },
            styles: {
                small: {
                    fontSize: 8
                },
                paddingLeft: {
                    margin: [50, 0, 0, 0]
                },
                paddingTop: {
                    margin: [0, 15, 0, 0]
                },
                defaultStyle: {
                    font: 'Roboto'
                }
            }
        }
        this.createPdf(dd)
    }

    public createVoucherOnServer(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/createVoucher', formData)
    }

    public emailVoucher(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/emailVoucher', formData)
    }

    //#endregion

    //#region private methods   

    private createPdf(document: any): void {
        pdfMake.fonts = {
            Roboto: { normal: 'Roboto-Regular.ttf' }
        }
        pdfMake.createPdf(document).open()
    }

    //#endregion

}
