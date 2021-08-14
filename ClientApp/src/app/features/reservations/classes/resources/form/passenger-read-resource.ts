import { Guid } from "guid-typescript"

export class PassengerReadResource {

    id: number
    
    reservationId: Guid

    occupant: { id: number, description: string }
    nationality: { id: number, description: string }
    gender: { id: number, description: string }

    lastname: string
    firstname: string
    birthdate: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}