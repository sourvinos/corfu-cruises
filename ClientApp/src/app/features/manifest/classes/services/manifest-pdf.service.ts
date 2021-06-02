import { Injectable } from '@angular/core'
import { ShipRoute } from 'src/app/features/ships/routes/classes/shipRoute'
import pdfMake from 'pdfmake/build/pdfmake'
// Custom
import { ManifestPassenger } from '../view-models/manifest-passenger'
import { ManifestViewModel } from './../view-models/manifest-view-model'

@Injectable({ providedIn: 'root' })

export class ManifestPdfService {

    //#region variables

    private rowCount = 0

    //#endregion

    //#region public methods

    public createReport(shipRoute: ShipRoute, manifest: ManifestViewModel): void {
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
                                [this.createShipRoute(shipRoute), ''],
                                [this.createDataEntryPrimaryPerson(manifest), this.createDataEntrySecondaryPerson(manifest)]
                            ],
                            style: 'table',
                            widths: ['50%', '50%'],
                        },
                        layout: 'noBorders'
                    },
                    [
                        this.table(manifest, ['', 'lastname', 'firstname', 'dob', 'nationalityDescription', 'occupantDescription', 'genderDescription', 'specialCare', 'remarks'], ['right', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left'])
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
                }
            }
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

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

    private createShipData(manifest: ManifestViewModel): string {
        return '' +
            'ΣΤΟΙΧΕΙΑ ΠΛΟΙΟΥ' + '\n' +
            'ΟΝΟΜΑ ' + manifest.shipResource.description + '\n' +
            'ΣΗΜΑΙΑ ' + manifest.shipResource.flag + '\n' +
            'ΑΡΙΘΜΟΣ ΝΗΟΛΟΓΙΟΥ ' + manifest.shipResource.registryNo + '\n' +
            'ΙΜΟ ' + manifest.shipResource.imo + '\n'
    }

    private createManager(manifest: ManifestViewModel): string {
        return '' +
            'ΣΤΟΙΧΕΙΑ ΕΤΑΙΡΙΑΣ' + '\n' +
            'ΥΠΕΥΘΥΝΟΣ ΔΙΑΧΕΙΡΙΣΤΗΣ ' + manifest.shipResource.manager + '\n' +
            'ΔΙΑΧΕΙΡΙΣΤΗΣ ΣΤΗΝ ΕΛΛΑΔΑ ' + manifest.shipResource.managerInGreece + '\n' +
            'ΥΠΕΥΘΥΝΟΙ ΝΑΥΤΙΚΟΙ ΠΡΑΚΤΟΡΕΣ ' + manifest.shipResource.agent + '\n'
    }

    private createDataEntryPrimaryPerson(manifest: ManifestViewModel): string {
        return '' +
            'ΥΠΕΥΘΥΝΟΣ ΚΑΤΑΓΡΑΦΗΣ' + '\n' +
            'ΟΝΟΜΑΤΕΠΩΝΥΜΟ ' + manifest.shipResource.dataEntryPersons[0].fullname + '\n' +
            'ΤΗΛΕΦΩΝΑ ' + manifest.shipResource.dataEntryPersons[0].phones + '\n' +
            'EMAIL ' + manifest.shipResource.dataEntryPersons[0].email + '\n' +
            'FAX ' + manifest.shipResource.dataEntryPersons[0].fax + '\n'
    }

    private createDataEntrySecondaryPerson(manifest: ManifestViewModel): string {
        return '' +
            'ΑΝΤΙΚΑΤΑΣΤΑΤΗΣ ΥΠΕΥΘΥΝΟΥ ΚΑΤΑΓΡΑΦΗΣ' + '\n' +
            'ΟΝΟΜΑΤΕΠΩΝΥΜΟ ' + manifest.shipResource.dataEntryPersons[1].fullname + '\n' +
            'ΤΗΛΕΦΩΝΑ ' + manifest.shipResource.dataEntryPersons[1].phones + '\n' +
            'EMAIL ' + manifest.shipResource.dataEntryPersons[1].email + '\n' +
            'FAX ' + manifest.shipResource.dataEntryPersons[1].fax + '\n'
    }

    private createTitle(manifest: ManifestViewModel): string {
        return '' +
            'ΔΡΟΜΟΛΟΓΙΟ ΤΗΣ ' + manifest.date + '\n' +
            'ΚΑΤΑΣΤΑΣΗ ΕΠΙΒΑΙΝΟΝΤΩΝ'
    }

    private createSignature(manifest: ManifestViewModel): string {
        return '' +
            'ΒΕΒΑΙΩΝΕΤΑΙ Η ΑΚΡΙΒΕΙΑ ΤΩΝ ΩΣ ΑΝΩ ΣΤΟΙΧΕΙΩΝ' + '\n' +
            'ΚΑΙ ΠΛΗΡΟΦΟΡΙΩΝ ΑΠΟ ΤΟΝ / ΤΗΝ' + '\n' +
            manifest.shipResource.manager + '\n' +
            'ΠΟΥ ΕΧΕΙ ΟΡΙΣΤΕΙ ΑΠΟ ΤΗΝ ΕΤΑΙΡΙΑ ΓΙΑ ΤΗ ΔΙΑΒΙΒΑΣΗ ΤΟΥΣ ΣΤΗΝ ΑΡΧΗ'
    }

    private createShipRoute(shipRoute: ShipRoute): string {
        return '' +
            'ΛΙΜΕΝΑΣ ΑΠΟΠΛΟΥ ' + shipRoute.fromPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + '---' + ' ΩΡΑ ' + shipRoute.fromTime + '\n' +
            'ΕΝΔΙΑΜΕΣΟΙ ΛΙΜΕΝΕΣ ΠΡΟΣΕΓΓΙΣΗΣ ' + shipRoute.viaPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + '---' + ' ΩΡΑ ' + shipRoute.viaTime + '\n' +
            'ΛΙΜΕΝΑΣ ΚΑΤΑΠΛΟΥ ' + shipRoute.toPort + ' ΗΜΕΡΟΜΗΝΙΑ ' + '---' + ' ΩΡΑ ' + shipRoute.toTime
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

    private createPageHeader(manifest: ManifestViewModel): string {
        return manifest.shipResource.shipOwner.description + '\n' +
            manifest.shipResource.shipOwner.profession + '\n' +
            manifest.shipResource.shipOwner.address + '\n' +
            manifest.shipResource.shipOwner.city + '\n' +
            manifest.shipResource.shipOwner.phones + '\n' +
            manifest.shipResource.shipOwner.taxNo + '\n'
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).download('Manifest.pdf')
    }

    private processRow(columns: any[], row: ManifestPassenger, dataRow: any[], align: any[]): any {
        columns.forEach((element, index) => {
            if (index == 0) {
                dataRow.push({ text: ++this.rowCount, alignment: 'right', color: '#000000', noWrap: false })
            } else {
                dataRow.push({ text: row[element].toString(), alignment: align[index].toString(), color: '#000000', noWrap: false })
            }
        })
        return dataRow
    }

    private table(data: ManifestViewModel, columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.buildTableBody(data, columns, align),
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

