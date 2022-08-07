import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Injectable } from '@angular/core'
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
        this.records = records
        console.log(this.records)
        this.createReservationLine()
        this.populateCriteriaFromStoredVariables()

        const dd = {
            background: [
                {
                    image: this.logoService.getLogo(),
                    width: '1000',
                    opacity: 0.03
                }
            ],
            info: {
                title: 'Awesonme document',
                filename: 'Boo.pdf'
            },
            pageOrientation: 'portrait',
            pageSize: 'A4',
            content: [
                {
                    margin: [-10, 0, 0, 20],
                    columns: [
                        {
                            type: 'none',
                            ul: [
                                { text: 'Corfu Cruises', fontSize: 20, alignment: 'left', color: '#0a5f91', margin: [-5, 0, 0, 0] },
                                { text: 'Embarkation Report', fontSize: 10, alignment: 'left', color: '#22a7f2', margin: [-4, 0, 0, 0] }
                            ]
                        },
                        {
                            type: 'none',
                            ul: [
                                { text: 'Date: ' + this.helperService.formatISODateToLocale(this.criteria.date), alignment: 'right', fontSize: 8, color: '#0a5f91' },
                                { text: 'Destination: ' + this.singleOrAllCriteria(this.criteria.destination), alignment: 'right', fontSize: 8, color: '#0a5f91' },
                                { text: 'Port: ' + this.singleOrAllCriteria(this.criteria.port), alignment: 'right', fontSize: 8, color: '#0a5f91' },
                                { text: 'Ship: ' + this.singleOrAllCriteria(this.criteria.ship), alignment: 'right', fontSize: 8, color: '#0a5f91' }
                            ]
                        }
                    ]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*', '*', '*', '*', 25],
                        body: this.rows,
                    }, layout: 'lightHorizontalLines'
                },
            ],
            footer: (currentPage: { toString: () => string }, pageCount: string) => {
                return {
                    layout: 'noBorders',
                    margin: [0, 10, 40, 10],
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [
                                { text: '' },
                                { text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', fontSize: 6 }
                            ]
                        ]
                    }
                }
            }
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    //#endregion

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
            this.criteria = {
                'date': criteria.date,
                'destination': criteria.destination,
                'port': criteria.port,
                'ship': criteria.ship
            }
        }
    }

    private createReservationLine(): void {
        this.rows.push([
            { text: 'RefNo', fontSize: 6, margin: [0, 0, 0, 0] },
            { text: 'TicketNo', fontSize: 6 },
            { text: 'Destination', fontSize: 6 },
            { text: 'Customer', fontSize: 6 },
            { text: 'Driver', fontSize: 6 },
            { text: 'Port', fontSize: 6 },
            { text: 'Ship', fontSize: 6 },
            { text: 'Remarks', fontSize: 6 },
            { text: 'Persons', fontSize: 6, alignment: 'right' }
        ])
        for (const reservation of this.records) {
            this.rows.push([
                { text: reservation.refNo, fontSize: 5, margin: [0, 0, 0, 0] },
                { text: reservation.ticketNo, fontSize: 5 },
                { text: reservation.destination, fontSize: 5 },
                { text: reservation.customer, fontSize: 5 },
                { text: reservation.driver, fontSize: 5 },
                { text: reservation.port, fontSize: 5 },
                { text: reservation.ship, fontSize: 5 },
                { text: reservation.remarks, fontSize: 5 },
                { text: reservation.totalPersons, alignment: 'right', fontSize: 5 },
            ])
            for (const passenger of reservation.passengers) {
                this.rows.push([
                    { text: '' },
                    { text: '' },
                    { text: passenger.lastname, colSpan: 2, alignment: 'left', fontSize: 5 },
                    { text: '' },
                    { text: passenger.firstname, colSpan: 3, alignment: 'left', fontSize: 5 },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' }
                ])
            }
        }
    }

    private singleOrAllCriteria(criteria: { id: string; description: string }): string {
        return criteria.id == 'all' ? 'ALL' : criteria.description
    }

}
