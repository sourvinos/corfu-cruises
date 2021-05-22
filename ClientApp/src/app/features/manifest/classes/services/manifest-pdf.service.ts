import { Injectable } from '@angular/core'
import * as pdfMake from 'pdfmake/build/pdfmake.js'
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js'
// Custom
import { ManifestPassenger } from '../view-models/manifest-passenger'
import { ManifestViewModel } from './../view-models/manifest-view-model'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class ManifestPdfService {

    //#region public methods

    public createReport(manifest: ManifestViewModel): void {
        const dd = {
            pageMargins: [50, 40, 50, 50],
            pageOrientation: 'portrait',
            defaultStyle: { fontSize: 7 },
            header: this.createPageHeader(manifest),
            footer: 'Footer',
            content: this.table(manifest, ['lastname', 'firstname', 'dob', 'nationalityDescription', 'occupantDescription', 'genderDescription', 'specialCare', 'remarks'], ['left', 'left', 'left', 'left', 'left', 'left', 'left', 'left'])
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

    private table(data: ManifestViewModel, columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, align),
                heights: 10,
                widths: ['25%', '20%', '10%', '10%', '10%', '10%', '10%', '10%'],
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    private buildTableBody(data: ManifestViewModel, columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.createTableHeaders())
        data.passengers.forEach((row) => {
            let dataRow = []
            dataRow = this.processRow(columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'Last name', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'First name', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'DoB', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'Nationality', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'Occupant', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'Gender', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'Special care', style: 'tableHeader', alignment: 'left', bold: true },
            { text: 'Remarks', style: 'tableHeader', alignment: 'left', bold: true },
        ]
    }

    private createPageHeader(manifest: ManifestViewModel) {
        return function (): any {
            return {
                table: {
                    widths: '*',
                    body: [[
                        { text: 'Ship: ' + manifest.ship, alignment: 'left', bold: true, margin: [50, 20, 50, 60] }
                    ]]
                },
                layout: 'noBorders'
            }
        }
    }

    private createPageFooter() {
        return function (currentPage: any, pageCount: any): any {
            return {
                table: {
                    widths: '*',
                    body: [[{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: 'normalText', margin: [0, 10, 50, 0] }]]
                },
                layout: 'noBorders'
            }
        }
    }

    private createBlankLine(): any {
        const dataRow = []
        dataRow.push(
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).download('Manifest.pdf')
    }

    private processRow(columns: any[], row: ManifestPassenger, dataRow: any[], align: any[]): any {
        columns.forEach((element, index) => {
            if (row[element].toString() === '0') { row[element] = '' }
            dataRow.push({ text: row[element].toString(), alignment: align[index].toString(), color: '#000000', noWrap: false, })
        })
        return dataRow
    }

    //#endregion

}

