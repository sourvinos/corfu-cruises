import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { Injectable } from '@angular/core'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// Custom
import { ManifestPassengerVM } from '../view-models/manifest-passenger-vm'
import { ManifestVM } from '../view-models/manifest-vm'
import { HelperService } from 'src/app/shared/services/helper.service'

@Injectable({ providedIn: 'root' })

export class ManifestPdfService {

    //#region variables

    private rowCount: number

    //#endregion

    constructor(private helperService: HelperService) { }

    //#region public methods

    public createReport(manifest: ManifestVM): void {
        this.rowCount = 0
        const dd = {
            pageMargins: 50,
            pageOrientation: 'portrait',
            pageSize: 'A4',
            defaultStyle: { fontSize: 7 },
            content:
                [
                    {
                        table: {
                            body: [
                                [this.createPageHeader(manifest), this.createTitle(manifest)],
                                [this.createShipData(manifest), this.createManager(manifest)],
                                [this.createShipRoute(manifest), ''],
                                [this.createDataEntryPrimaryPerson(manifest), this.createDataEntrySecondaryPerson(manifest)]
                            ],
                            style: 'table',
                            widths: ['50%', '50%'],
                        },
                        layout: 'noBorders'
                    },
                    [
                        this.table(manifest,
                            ['', '', '', 'date', '', '', '', '', ''],
                            ['', 'lastname', 'firstname', 'birthdate', 'nationalityDescription', 'occupantDescription', 'genderDescription', 'specialCare', 'remarks'],
                            ['right', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left'])
                    ],
                    {
                        table: {
                            body: [
                                ['', this.createSignature(manifest)]
                            ],
                            widths: ['50%', '50%']
                        },
                        layout: 'noBorders'
                    }
                ],
            styles: {
                table: {
                    fontSize: 7,
                    bold: false
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

    //#endregion

    //#region private methods

    private buildTableBody(data: ManifestVM, columnTypes: any[], columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.createTableHeaders())
        data.passengers.forEach((row) => {
            let dataRow = []
            dataRow = this.processRow(columnTypes, columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private createShipData(manifest: ManifestVM): string {
        return '' +
            'ΣΤΟΙΧΕΙΑ ΠΛΟΙΟΥ' + '\n' +
            'ΟΝΟΜΑ ' + manifest.ship.description + '\n' +
            'ΣΗΜΑΙΑ ' + manifest.ship.flag + '\n' +
            'ΑΡΙΘΜΟΣ ΝΗΟΛΟΓΙΟΥ ' + manifest.ship.registryNo + '\n' +
            'ΙΜΟ ' + manifest.ship.imo + '\n'
    }

    private createManager(manifest: ManifestVM): string {
        return '' +
            'ΣΤΟΙΧΕΙΑ ΕΤΑΙΡΙΑΣ' + '\n' +
            'ΥΠΕΥΘΥΝΟΣ ΔΙΑΧΕΙΡΙΣΤΗΣ ' + manifest.ship.manager + '\n' +
            'ΔΙΑΧΕΙΡΙΣΤΗΣ ΣΤΗΝ ΕΛΛΑΔΑ ' + manifest.ship.managerInGreece + '\n' +
            'ΥΠΕΥΘΥΝΟΙ ΝΑΥΤΙΚΟΙ ΠΡΑΚΤΟΡΕΣ ' + manifest.ship.agent + '\n'
    }

    private createDataEntryPrimaryPerson(manifest: ManifestVM): string {
        return '' +
            'ΥΠΕΥΘΥΝΟΣ ΚΑΤΑΓΡΑΦΗΣ' + '\n' +
            'ΟΝΟΜΑΤΕΠΩΝΥΜΟ ' + manifest.ship.registrars[0].fullname + '\n' +
            'ΤΗΛΕΦΩΝΑ ' + manifest.ship.registrars[0].phones + '\n' +
            'EMAIL ' + manifest.ship.registrars[0].email + '\n' +
            'FAX ' + manifest.ship.registrars[0].fax + '\n'
    }

    private createDataEntrySecondaryPerson(manifest: ManifestVM): string {
        return '' +
            'ΑΝΤΙΚΑΤΑΣΤΑΤΗΣ ΥΠΕΥΘΥΝΟΥ ΚΑΤΑΓΡΑΦΗΣ' + '\n' +
            'ΟΝΟΜΑΤΕΠΩΝΥΜΟ ' + manifest.ship.registrars[1].fullname + '\n' +
            'ΤΗΛΕΦΩΝΑ ' + manifest.ship.registrars[1].phones + '\n' +
            'EMAIL ' + manifest.ship.registrars[1].email + '\n' +
            'FAX ' + manifest.ship.registrars[1].fax + '\n'
    }

    private createTitle(manifest: ManifestVM): string {
        return '' +
            'ΔΡΟΜΟΛΟΓΙΟ ΤΗΣ ' + manifest.date + '\n' +
            'ΚΑΤΑΣΤΑΣΗ ΕΠΙΒΑΙΝΟΝΤΩΝ'
    }

    private createSignature(manifest: ManifestVM): string {
        return '' +
            'ΒΕΒΑΙΩΝΕΤΑΙ Η ΑΚΡΙΒΕΙΑ ΤΩΝ ΩΣ ΑΝΩ ΣΤΟΙΧΕΙΩΝ' + '\n' +
            'ΚΑΙ ΠΛΗΡΟΦΟΡΙΩΝ ΑΠΟ ΤΟΝ / ΤΗΝ' + '\n' +
            manifest.ship.manager + '\n' +
            'ΠΟΥ ΕΧΕΙ ΟΡΙΣΤΕΙ ΑΠΟ ΤΗΝ ΕΤΑΙΡΙΑ ΓΙΑ ΤΗ ΔΙΑΒΙΒΑΣΗ ΤΟΥΣ ΣΤΗΝ ΑΡΧΗ'
    }

    private createShipRoute(manifest: ManifestVM): string {
        return '' +
            'ΛΙΜΕΝΑΣ ΑΠΟΠΛΟΥ ' + manifest.shipRoute.fromPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + this.helperService.formatISODateToLocale(manifest.date) + ' ΩΡΑ ' + manifest.shipRoute.fromTime + '\n' +
            'ΕΝΔΙΑΜΕΣΟΙ ΛΙΜΕΝΕΣ ΠΡΟΣΕΓΓΙΣΗΣ ' + manifest.shipRoute.viaPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + this.helperService.formatISODateToLocale(manifest.date) + ' ΩΡΑ ' + manifest.shipRoute.viaTime + '\n' +
            'ΛΙΜΕΝΑΣ ΚΑΤΑΠΛΟΥ ' + manifest.shipRoute.toPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + this.helperService.formatISODateToLocale(manifest.date) + ' ΩΡΑ ' + manifest.shipRoute.toTime
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'Α/Α', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΕΠΩΝΥΜΟ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΟΝΟΜΑ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΗΜΕΡΟΜΗΝΙΑ ΓΕΝΝΗΣΗΣ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΙΘΑΓΕΝΕΙΑ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΙΔΙΟΤΗΤΑ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΦΥΛΟ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΕΙΔΙΚΗ ΦΡΟΝΤΙΔΑ', style: 'tableHeader', alignment: 'center', bold: true },
            { text: 'ΠΑΡΑΤΗΡΗΣΕΙΣ', style: 'tableHeader', alignment: 'center', bold: true },
        ]
    }

    private createPageHeader(manifest: ManifestVM): string {
        return manifest.ship.shipOwner.description + '\n' +
            manifest.ship.shipOwner.profession + '\n' +
            manifest.ship.shipOwner.address + '\n' +
            manifest.ship.shipOwner.city + '\n' +
            manifest.ship.shipOwner.phones + '\n' +
            manifest.ship.shipOwner.taxNo + '\n'
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private formatField(type: any, field: string | number | Date): string {
        switch (type) {
            case 'date':
                return field.toString()
            default:
                return field != undefined ? field.toString() : ''
        }
    }

    private processRow(columnTypes: any[], columns: any[], row: ManifestPassengerVM, dataRow: any[], align: any[]): any {
        columns.forEach((element, index) => {
            if (element != undefined) {
                if (index == 0) {
                    dataRow.push({ text: ++this.rowCount, alignment: 'right', color: '#000000', noWrap: false })
                } else {
                    dataRow.push({ text: this.formatField(columnTypes[index], row[element]), alignment: align[index].toString(), color: '#000000', noWrap: false })
                }
            }
        })
        return dataRow
    }

    private table(data: ManifestVM, columnTypes: any[], columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columnTypes, columns, align),
                heights: 10,
                bold: false,
                style: 'table',
                layout: 'noBorders',
                widths: [20, 80, 50, 50, 40, '10%', '10%', 50, 60],
            },
            layout: {
                vLineColor: function (i: number, node: { table: { widths: string | any[] } }): any { return (i === 1 || i === node.table.widths.length - 1) ? '#dddddd' : '#dddddd' },
                vLineStyle: function (): any { return { dash: { length: 50, space: 0 } } },
                paddingTop: function (i: number): number { return (i === 0) ? 5 : 5 },
                paddingBottom: function (): number { return 2 }
            }
        }
    }

    //#endregion

}

