import { Guid } from "guid-typescript"

export class ReservationFlat {

    id: Guid
    destination: string
    destinationAbbreviation: string
    customer: string
    route: string
    pickupPoint: string
    time: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    port: string
    driver: string
    ship: string
    dateIn: string
    remarks: string

}
