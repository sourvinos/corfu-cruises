import { Guid } from 'guid-typescript'

export class ReservationFlat {

    id: Guid
    date: string
    destination: string
    refNo: string
    ticketNo: string
    destinationAbbreviation: string
    customer: string
    route: string
    pickupPoint: string
    port: string
    driver: string
    ship: string
    time: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    remarks: string

}
