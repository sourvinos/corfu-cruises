import { Guid } from "guid-typescript"
import { BoardingDetail } from "./boarding-detail"

export class Boarding {

    reservationId: Guid
    ticketNo: string
    totalPersons: number
    driver: string
    remarks: string

    passengers: BoardingDetail[]

}
