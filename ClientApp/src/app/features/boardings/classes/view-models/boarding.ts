import { Guid } from "guid-typescript"
import { BoardingPassenger } from "./boarding-passenger"

export class Boarding {

    reservationId: Guid
    ticketNo: string
    totalPersons: number
    customer: string
    driver: string
    remarks: string
    isBoarded: string

    passengers: BoardingPassenger[]

}
