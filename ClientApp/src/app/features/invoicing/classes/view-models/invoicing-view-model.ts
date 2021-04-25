import { Guid } from "guid-typescript"

export class InvoicingViewModel {

    reservationId: Guid
    date: string
    customerDescription: string
    destinationDescription: string
    shipDescription: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string
    isTransfer: boolean
    remarks: string

}
