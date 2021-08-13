import { Guid } from "guid-typescript"

export class Passenger {

    id: number
 
    reservationId: Guid

    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

    nationality: { id: number, description: string }
    occupant: { id: number, description: string }
    gender: { id: number, description: string }

}