import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Injectable } from '@angular/core'
// Fonts
import 'src/assets/fonts/ACCanterBold.js'
import 'src/assets/fonts/NotoSansMonoCondensedRegular.js'
import 'src/assets/fonts/PFHandbookProThin.js'
// Custom
import { EmbarkationVM } from '../view-models/embarkation-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class NewEmbarkationPDFService {

    //#region variables

    private criteria: any
    private records: EmbarkationVM[]
    private rows = []

    //#endregion

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private logoService: LogoService) { }

    //#region public methods

    public createPDF(records: EmbarkationVM[]): void {
        console.log(records)
        this.records = records
        this.createReservationLine()
        this.populateCriteriaFromStoredVariables('CAPTAIN BILL')
        const dd = {
            pageMargins: 30,
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 6 },
            content:
                [
                    {
                        table: {
                            body: [
                                [this.createLogo(), this.createTitle(), [this.createCriteria()]]
                            ],
                            widths: ['20%', '40%', '40%'],
                            heights: 60,
                        }, layout: 'noBorders'
                    }, {
                        table: {
                            body: this.rows
                        }, layout: ''
                    }
                ],
            styles: {
                table: {
                    fontSize: 6,
                    bold: false
                },
                paddingLeft: {
                    margin: [50, 0, 0, 0]
                },
                paddingTop: {
                    margin: [0, 15, 0, 0]
                },
            }
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

    private createPdf(document: any): void {
        // pdfMake.fonts = {
        //     Roboto: { normal: 'Roboto-Regular.ttf' }
        // }
        pdfMake.createPdf(document).open()
    }

    //#endregion

    private createLogo(): any[] {
        return [{ image: this.logoService.getLogo(), fit: [40, 40], alignment: 'center' }]
    }

    private createTitle(): any[] {
        return [
            { text: 'CORFU CRUISES', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 14 },
            { text: 'Embarkation Report', style: 'tableHeader', alignment: 'center', bold: true }
        ]
    }

    private createCriteria(): any[] {
        return [
            { text: 'Date ' + this.criteria.date, style: 'tableHeader', alignment: 'right', bold: true },
            { text: 'Destination ' + this.criteria.destination.description, style: 'tableHeader', alignment: 'right', bold: true },
            { text: 'Port ' + this.criteria.port.description, style: 'tableHeader', alignment: 'right', bold: true },
            { text: 'Ship ' + this.criteria.ship, style: 'tableHeader', alignment: 'right', bold: true },
        ]
    }

    private populateCriteriaFromStoredVariables(ship: any): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.criteria = {
                'date': criteria.date,
                'destination': criteria.destination,
                'port': criteria.port,
                'ship': ship
            }
        }
    }

    private createReservationLine(): void {
        for (const reservation of this.records) {
            this.rows.push([{ text: reservation.refNo }, { text: reservation.ticketNo }, { text: reservation.customer }, { text: reservation.driver }, { text: reservation.totalPersons, alignment: 'right' }, { text: reservation.remarks },])
            for (const passenger of reservation.passengers) {
                this.rows.push([{}, { text: passenger.lastname, colSpan: 2, alignment: 'left' }, {}, { text: passenger.firstname, colSpan: 3, alignment: 'left' }, {}, {}])
            }
        }
    }

}
