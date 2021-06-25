import { Guid } from "guid-typescript"
import { EmbarkationPassenger } from "./embarkation-passenger"

export class Embarkation {

    reservationId: Guid
    ticketNo: string
    totalPersons: number
    customer: string
    driver: string
    remarks: string
    isBoarded: string

    passengers: EmbarkationPassenger[]

}
