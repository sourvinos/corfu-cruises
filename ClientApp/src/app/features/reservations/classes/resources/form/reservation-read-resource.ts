import { Guid } from "guid-typescript"
import { PassengerReadResource } from "./passenger-read-resource"

export class ReservationReadResource {

    reservationId: Guid

    date: string
    email: string
    phones: string
    remarks: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string

    customer: { id: number, description: string }
    destination: { id: number, description: string }
    driver: { id: number, description: string }
    pickupPoint: { id: number, description: string, port: { id: number, description: string } }
    ship: { id: number, description: string }

    user: { id: number, description: string }

    passengers: PassengerReadResource

}

