import { BoardingDetail } from "./boarding-detail"

export class Boarding {

    // Base
    bookingId: number
    ticketNo: string
    remarks: string

    // Totals
    allPersons: number
    boardedPersons: number
    remainingPersons: number

    // Passengers
    details: BoardingDetail[]

}
