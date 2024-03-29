import { Injectable } from '@angular/core'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// Custom
import { BooleanIconService } from 'src/app/shared/services/boolean-icon.service'
import { PickupPointListVM } from '../view-models/pickupPoint-list-vm'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from '../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strPFHandbookPro } from '../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class PickupPointPdfService {

    constructor(private booleanIconService: BooleanIconService) { }

    //#region public methods

    public createReport(pickupPoints: PickupPointListVM[]): void {
        this.setFonts()
        const document = {
            content: [
                this.buildTable(pickupPoints, ['isActive', 'coachRouteAbbreviation', 'description', 'exactPoint', 'time'], ['boolean', null, null, null, null])
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
                fontSize: 8
            },
        }
        pdfMake.createPdf(document).open()
    }

    //#endregion

    //#region private methods

    private buildTableBody(data: PickupPointListVM[], columns: any[], columnTypes: any[]): void {
        const body: any = []
        body.push(this.createTableHeaders())
        data.forEach((row: any) => {
            let dataRow = []
            dataRow = this.processRow(columns, columnTypes, row, dataRow)
            body.push(dataRow)
        })
        return body
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'Active', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'Route', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'Description', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'Exact point', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'Time', style: 'tableHeader', alignment: 'center', bold: false },
        ]
    }

    private processRow(columns: any[], columnTypes: any[], row: any, dataRow: any[]): any {
        columns.forEach((column, index) => {
            if (columnTypes[index] == 'boolean') {
                if (row[column] == true) {
                    dataRow.push({ image: this.booleanIconService.getTrueIcon(), fit: [8, 8], alignment: 'center' })
                } else {
                    dataRow.push({ image: this.booleanIconService.getFalseIcon(), fit: [8, 8], alignment: 'center' })
                }
            } else {
                dataRow.push({ text: row[column], noWrap: false })
            }
        })
        return dataRow
    }

    private buildTable(data: PickupPointListVM[], columns: any[], columnTypes: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, columnTypes),
                heights: 10,
                bold: false,
                style: 'table',
                layout: 'noBorders'
            },
            layout: 'lightHorizontalLines'
        }
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

    //#endregion

}

