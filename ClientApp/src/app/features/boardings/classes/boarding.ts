import { BoardingDetail } from "./boarding-detail"

export class Boarding {

    bookingId: number

    ticketNo: string

    allPersons: number
    boardedPersons: number
    remainingPersons: number

    details: BoardingDetail[]

}
