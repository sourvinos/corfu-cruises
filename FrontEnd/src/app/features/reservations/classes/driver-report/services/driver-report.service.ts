import pdfMake from 'pdfmake/build/pdfmake'
import { Injectable } from '@angular/core'
// Custom
import { DriverReportDto } from '../dtos/driver-report-dto'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { DriverReportHeaderDto } from '../dtos/driver-report-header-dto'
import { DriverReportReservationDto } from '../dtos/driver-report-reservation-dto'
import { ReservationService } from '../../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class DriverReportService {

    //#region variables

    private driverReport: DriverReportDto

    //#endregion

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private reservationService: ReservationService) { }

    //#region public methods

    public doReportTasks(driverIds: number[]): void {
        driverIds.sort(function (a, b) { return a - b })
        driverIds.forEach(driverId => {
            this.reservationService.getByDateAndDriver(this.localStorageService.getItem('date'), driverId).subscribe(response => {
                this.mapObjectFromAPI(response)
                this.createReport()
            })
        })
    }

    //#endregion

    //#region private methods

    private addPersonsToPickupPoint(pickupPointCount: number, total: number[], row: { adults: any; kids: any; free: any; totalPersons: any }): any {
        pickupPointCount += 1
        total[0] += Number(row.adults)
        total[1] += Number(row.kids)
        total[2] += Number(row.free)
        total[3] += Number(row.totalPersons)
        return { pickupPointCount, total }
    }

    private createReport(): void {
        const dd = {
            pageMargins: [50, 40, 50, 50],
            pageOrientation: 'landscape',
            defaultStyle: { fontSize: 7 },
            header: this.createPageHeader(),
            footer: this.createPageFooter(),
            content: this.table(this.driverReport.reservations,
                ['time', 'refNo', 'ticketNo', 'pickupPointDescription', 'exactPoint', 'adults', 'kids', 'free', 'totalPersons', 'customerDescription', 'fullname', 'remarks', 'destinationAbbreviation'],
                ['center', 'center', 'center', 'left', 'left', 'right', 'right', 'right', 'right', 'left', 'left', 'left', 'center'])
        }
        this.createPdf(dd)
    }

    private table(reservations: any, columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(reservations, columns, align),
                heights: 10,
                widths: [20, 40, 40, '*', '*', 15, 15, 15, 15, 50, 100, 150, 20],
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    private buildTableBody(reservations: any, columns: any[], align: any[]): void {
        const body: any = []
        let pickupPointCount = 0
        let pickupPointPersons: number[] = [0, 0, 0, 0]
        let driverPersons: number[] = [0, 0, 0, 0]
        let pickupPointDescription = reservations[0].pickupPointDescription
        body.push(this.createTableHeaders())
        reservations.forEach(((reservation: DriverReportReservationDto) => {
            let dataRow = []
            if (reservation.pickupPointDescription === pickupPointDescription) {
                const { pickupPointCount: x, total: z } = this.addPersonsToPickupPoint(pickupPointCount, pickupPointPersons, reservation)
                pickupPointCount = x
                pickupPointPersons = z
            } else {
                if (pickupPointCount > 1) {
                    body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
                    dataRow = []
                }
                pickupPointCount = 1
                pickupPointDescription = reservation.pickupPointDescription
                pickupPointPersons = this.initPickupPointPersons(pickupPointPersons, reservation)
            }
            driverPersons = this.addPersonsToDriver(driverPersons, reservation)
            dataRow = this.replaceZerosWithBlanks(columns, reservation, dataRow, align)
            body.push(dataRow)
        }))
        if (pickupPointCount > 1) {
            body.push(this.createPickupPointTotalLine(pickupPointDescription, pickupPointPersons))
        }
        body.push(this.createBlankLine())
        body.push(this.createTotalLineForDriver(this.driverReport.header.driverDescription, driverPersons))
        return body
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'TIME', style: 'tableHeader', alignment: 'center' },
            { text: 'REFNO', style: 'tableHeader', alignment: 'center' },
            { text: 'TICKET NO', style: 'tableHeader', alignment: 'center' },
            { text: 'PICKUP POINT', style: 'tableHeader', alignment: 'center' },
            { text: 'EXACT POINT', style: 'tableHeader', alignment: 'center' },
            { text: 'A', style: 'tableHeader', alignment: 'center' },
            { text: 'K', style: 'tableHeader', alignment: 'center' },
            { text: 'F', style: 'tableHeader', alignment: 'center' },
            { text: 'T', style: 'tableHeader', alignment: 'center' },
            { text: 'CUSTOMER', style: 'tableHeader', alignment: 'center' },
            { text: 'GROUP LEADER', style: 'tableHeader', alignment: 'center' },
            { text: 'REMARKS', style: 'tableHeader', alignment: 'center' },
            { text: 'D', style: 'tableHeader', alignment: 'center' },
        ]
    }

    private createPickupPointTotalLine(pickupPoint: string, total: any[]): any[] {
        return [
            { text: '' },
            { text: '' },
            { text: '' },
            { text: 'TOTAL FROM ' + pickupPoint },
            { text: String(total[0]) === '0' ? '' : String(total[0]), alignment: 'right', fillColor: 'white' },
            { text: String(total[1]) === '0' ? '' : String(total[1]), alignment: 'right', fillColor: 'white' },
            { text: String(total[2]) === '0' ? '' : String(total[2]), alignment: 'right', fillColor: 'white' },
            { text: String(total[3]) === '0' ? '' : String(total[3]), alignment: 'right', fillColor: 'white' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        ]
    }

    private createPageHeader() {
        const date = this.helperService.formatISODateToLocale(this.driverReport.header.date)
        const driverInfo = this.driverReport.header.driverDescription + ', ' + this.driverReport.header.phones
        return function (): any {
            return {
                table: {
                    widths: '*',
                    body: [[
                        { text: 'DRIVER: ' + driverInfo, alignment: 'left', margin: [50, 20, 50, 60] },
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

    private replaceZerosWithBlanks(columns: any[], row: DriverReportReservationDto, dataRow: any[], align: any[]): any {
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

    private createTotalLineForDriver(data: any, totals: any[]): any[] {
        const dataRow = []
        dataRow.push(
            { text: '' },
            { text: '' },
            { text: '' },
            { text: 'TOTAL FOR ' + data },
            { text: String(totals[0]) === '0' ? '' : String(totals[0]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[1]) === '0' ? '' : String(totals[1]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[2]) === '0' ? '' : String(totals[2]), alignment: 'right', fillColor: 'white' },
            { text: String(totals[3]) === '0' ? '' : String(totals[3]), alignment: 'right', fillColor: 'white' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
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
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        )
        return dataRow
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private mapObjectFromAPI(response: any): void {
        this.driverReport = {
            header: this.mapHeaderFromAPI(response),
            reservations: this.mapReservationsFromAPI(response.reservations)
        }
    }

    private mapHeaderFromAPI(response: any): DriverReportHeaderDto {
        const header = {
            'date': response.date,
            'driverId': response.driverId,
            'driverDescription': response.driverDescription,
            'phones': response.phones
        }
        return header
    }

    private mapReservationsFromAPI(response: any[]): DriverReportReservationDto[] {
        const reservations = []
        response.forEach((reservation: DriverReportReservationDto) => {
            reservations.push({
                'refNo': reservation.refNo,
                'time': reservation.time,
                'ticketNo': reservation.ticketNo,
                'pickupPointDescription': reservation.pickupPointDescription,
                'exactPoint': reservation.exactPoint,
                'adults': reservation.adults,
                'kids': reservation.kids,
                'free': reservation.free,
                'totalPersons': reservation.totalPersons,
                'customerDescription': reservation.customerDescription,
                'fullname': reservation.fullname ?? '',
                'remarks': reservation.remarks,
                'destinationAbbreviation': reservation.destinationAbbreviation,
            })
        })
        return reservations
    }

    //#endregion

}