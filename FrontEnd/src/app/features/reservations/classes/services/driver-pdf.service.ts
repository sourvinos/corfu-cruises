import { Injectable } from '@angular/core'
import { ReservationFlat } from '../view-models/reservation-flat'
import pdfMake from 'pdfmake/build/pdfmake'

@Injectable({ providedIn: 'root' })

export class DriverPdfService {

    //#region public methods

    public createDriverReport(reservations: any[], drivers: any[], date: string): void {
        const array = this.sort(reservations)
        drivers.forEach(driver => {
            const filteredArray = array.filter((x: { driverDescription: any }) => x.driverDescription === driver.value)
            const dd = {
                pageMargins: [50, 40, 50, 50],
                pageOrientation: 'landscape',
                defaultStyle: { fontSize: 8 },
                header: this.createPageHeader(driver.value, date),
                footer: this.createPageFooter(),
                content: this.table(filteredArray, ['time', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'customerDescription', 'remarks', 'destinationAbbreviation'], ['center', 'left', 'right', 'right', 'right', 'right', 'left', 'left', 'center'], driver)
            }
            this.createPdf(dd, driver.value)
        })
    }

    //#endregion

    //#region private methods

    private table(data: any[], columns: any[], align: any[], driver: string): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, align, driver),
                heights: 10,
                widths: [20, '*', 15, 15, 15, 15, 150, 180, 20],
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    private buildTableBody(data: any[], columns: any[], align: any[], driver: string): void {
        const body: any = []
        let pickupPointCount = 0
        let pickupPointPersons: number[] = [0, 0, 0, 0]
        let driverPersons: number[] = [0, 0, 0, 0]
        let pickupPointDescription = data[0].pickupPointDescription
        body.push(this.createTableHeaders())
        data.forEach(((row) => {
            let dataRow = []
            if (row.pickupPointDescription === pickupPointDescription) {
                const { pickupPointCount: x, total: z } = this.addPersonsToPickupPoint(pickupPointCount, pickupPointPersons, row)
                pickupPointCount = x
                pickupPointPersons = z
            } else {
                if (pickupPointCount > 1) {
                    body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
                    dataRow = []
                }
                pickupPointCount = 1
                pickupPointDescription = row.pickupPointDescription
                pickupPointPersons = this.initPickupPointPersons(pickupPointPersons, row)
            }
            driverPersons = this.addPersonsToDriver(driverPersons, row)
            dataRow = this.replaceZerosWithBlanks(columns, row, dataRow, align)
            body.push(dataRow)
        }))
        if (pickupPointCount > 1) {
            body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
        }
        body.push(this.createBlankLine())
        body.push(this.createTotalLineForDriver(driver, driverPersons))
        return body
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'TIME', style: 'tableHeader', alignment: 'center' },
            { text: 'PICKUP POINT', style: 'tableHeader', alignment: 'center' },
            { text: 'A', style: 'tableHeader', alignment: 'center' },
            { text: 'K', style: 'tableHeader', alignment: 'center' },
            { text: 'F', style: 'tableHeader', alignment: 'center' },
            { text: 'T', style: 'tableHeader', alignment: 'center' },
            { text: 'CUSTOMER', style: 'tableHeader', alignment: 'center' },
            { text: 'REMARKS', style: 'tableHeader', alignment: 'center' },
            { text: 'D', style: 'tableHeader', alignment: 'center' },
        ]
    }

    private createPickupPointTotalLine(pickupPoint: string, total: any[]): any[] {
        return [
            { text: '' },
            { text: 'TOTAL FROM ' + pickupPoint },
            { text: String(total[0]) === '0' ? '' : String(total[0]), alignment: 'right', fillColor: 'white' },
            { text: String(total[1]) === '0' ? '' : String(total[1]), alignment: 'right', fillColor: 'white' },
            { text: String(total[2]) === '0' ? '' : String(total[2]), alignment: 'right', fillColor: 'white' },
            { text: String(total[3]) === '0' ? '' : String(total[3]), alignment: 'right', fillColor: 'white' },
            { text: '' },
            { text: '' },
            { text: '' }
        ]
    }

    private sort(array: ReservationFlat[]): any {
        const sortedArray = array.sort((a, b) => {
            if (a.driver > b.driver) { return 1 }
            if (a.driver > b.driver) { return 1 }
            if (a.time > b.time) { return 1 }
            if (a.time < b.time) { return -1 }
            if (a.pickupPoint > b.pickupPoint) { return 1 }
            if (a.pickupPoint < b.pickupPoint) { return -1 }
            if (a.customer > b.customer) { return 1 }
            if (a.customer < b.customer) { return -1 }
            if (a.destination > b.destination) { return 1 }
            if (a.destination < b.destination) { return -1 }
        })
        return sortedArray
    }

    private createPageHeader(driver: string, date: string) {
        return function (): any {
            return {
                table: {
                    widths: '*',
                    body: [[
                        { text: 'DRIVER: ' + driver, alignment: 'left', margin: [50, 20, 50, 60] },
                        { text: 'DATE: ' + date, alignment: 'right', margin: [50, 20, 50, 60] }
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

    private addPersonsToDriver(totals: number[], row: { adults: any; kids: any; free: any; totalPersons: any }): number[] {
        totals[0] += Number(row.adults)
        totals[1] += Number(row.kids)
        totals[2] += Number(row.free)
        totals[3] += Number(row.totalPersons)
        return totals
    }

    private replaceZerosWithBlanks(columns: any[], row: { [x: string]: { toString: () => any } }, dataRow: any[], align: any[]): any {
        columns.forEach((element, index) => {
            if (row[element].toString() === '0') {
                row[element] = ''
            }
            dataRow.push({ text: row[element].toString(), alignment: align[index].toString(), color: '#000000', noWrap: false, })
        })
        return dataRow
    }

    private initPickupPointPersons(total: number[], row: any): any[] {
        total[0] = Number(row.adults)
        total[1] = Number(row.kids)
        total[2] = Number(row.free)
        total[3] = Number(row.totalPersons)
        return total
    }

    private createTotalLineForDriver(driver: string, totals: any[]): any[] {
        const dataRow = []
        dataRow.push(
            { text: '' },
            { text: 'TOTAL FOR ' + driver },
            { text: String(totals[0]) === '0' ? '' : String(totals[0]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[1]) === '0' ? '' : String(totals[1]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[2]) === '0' ? '' : String(totals[2]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[3]) === '0' ? '' : String(totals[3]), alignment: 'right', fillColor: 'white' },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
    }

    private addPersonsToPickupPoint(pickupPointCount: number, total: number[], row: { adults: any; kids: any; free: any; totalPersons: any }): any {
        pickupPointCount += 1
        total[0] += Number(row.adults)
        total[1] += Number(row.kids)
        total[2] += Number(row.free)
        total[3] += Number(row.totalPersons)
        return { pickupPointCount, total }
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

    private createPdf(document: any, driver: string): void {
        pdfMake.createPdf(document).download(driver + '.pdf')
    }

    //#endregion

}
