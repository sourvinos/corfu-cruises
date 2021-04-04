import { Guid } from "guid-typescript"

export class Passenger {

    id: number
    reservationId: Guid
    occupant: {
        id: number
        description: string
    }
    nationality: {
        id: number
        description: string
        flagUrl: string
    }
    gender: {
        id: number
        description: string
    }
    lastname: string
    firstname: string
    dob: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}