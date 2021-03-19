import { BookingDetail } from "./booking-detail"

export class Booking {

    bookingId: number

    date: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string
    email: string
    phones: string
    remarks: string

    customer: {
        id: number
        description: string
    }
    destination: {
        id: number
        abbreviation: string
        description: string
    }
    driver: {
        id: number
        description: string
    }
    pickupPoint: {
        id: number
        description: string
        time: string
        route: {
            id: number
            abbreviation: string
            description: string
            port: {
                id: number
                description: string
            }
        }
    }
    port: {
        id: number
        description: string
    }
    ship: {
        id: number
        description: string
    }

    userId: string

    details: BookingDetail[]

}
