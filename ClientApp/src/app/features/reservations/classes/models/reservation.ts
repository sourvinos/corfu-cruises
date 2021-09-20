import { Guid } from 'guid-typescript'
import { Passenger } from './passenger'

export class Reservation {

    reservationId: Guid

    date: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string
    email: string
    phones: string
    remarks: string

    destinationDescription:  string
    customerDescription:  string
    driverDescription:  string
    pickupPointDescription:  string
    portDescription:  string
    shipDescription:  string

    userId: { id: string, description: string }

    passengers: Passenger[]

}
