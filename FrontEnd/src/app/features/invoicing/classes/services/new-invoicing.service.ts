import { Injectable } from '@angular/core'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
// Fonts
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { strPFHandbookPro } from '../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'
import { strAkaAcidCanterBold } from '../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { InvoicingVM } from '../view-models/invoicing-vm'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class NewInvoicingPDFService {

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(record: InvoicingVM): void {
        this.setFonts()
        const dd = {
            background: this.setBackgroundImage(),
            info: this.setPageInfo(),
            pageOrientation: 'portrait',
            pageSize: 'A4',
            content: [
                {
                    margin: [-10, 0, 0, 20],
                    columns: [
                        this.setLogo(),
                        this.setTitle(),
                        this.setCriteria(this.populateCriteriaFromStoredVariables())
                    ]
                },
                {
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: this.createPortGroup(record.portGroup),
                    }, layout: 'lightHorizontalLines'
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

    private populateCriteriaFromStoredVariables(): any {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            return {
                'fromDate': criteria.fromDate,
                'toDate': criteria.toDate,
                'customer': criteria.customer.description
            }
        }
    }

    private createPortGroup(portGroup: any): any {
        const rows = []
        rows.push([
            { text: 'Adults', fontSize: 6 },
            { text: 'Kids', fontSize: 6 },
            { text: 'Free', fontSize: 6 },
            { text: 'Total', fontSize: 6 },
            { text: 'Actual', fontSize: 6 },
            { text: 'Transfer', fontSize: 6 }
        ])
        for (const transfer of portGroup) {
            for (const port of transfer.hasTransferGroup) {
                rows.push([
                    { text: port.adults, alignment: 'right', fontSize: 5 },
                    { text: port.kids, alignment: 'right', fontSize: 5 },
                ])
            }
        }
        return rows
    }

    private singleOrAllCriteria(criteria: { id: string; description: string }): string {
        return criteria.id == 'all' ? 'ALL' : criteria.description
    }

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['PFHandbookPro'] = strPFHandbookPro
        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
            },
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
                image: this.logoService.getLogo(),
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

    private setCriteria(criteriaFromStorage: any): any {
        const criteria = {
            type: 'none',
            ul: [
                { text: 'Date range: ' + this.helperService.formatISODateToLocale(criteriaFromStorage.fromDate + ' ' + this.helperService.formatISODateToLocale(criteriaFromStorage.toDate)), alignment: 'right', color: '#0a5f91', fontSize: 8 },
                { text: 'Customer: ' + criteriaFromStorage.customer, alignment: 'right', color: '#0a5f91', fontSize: 8 }
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

    private formatPassengerCount(index: number): string {
        const paddedValue = '0' + index
        return paddedValue.substring(paddedValue.length - 2) + '. '
    }

    //#endregion

}