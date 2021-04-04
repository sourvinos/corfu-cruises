import { Guid } from "guid-typescript"
import { BoardingDetail } from "./boarding-detail"

export class Boarding {

    reservationId: Guid
    ticketNo: string
    remarks: string

    passengers: BoardingDetail[]

}
