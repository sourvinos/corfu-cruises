import { Guid } from "guid-typescript"

export class PassengerWriteResource {

    id: number
    reservationId: Guid
    occupantId: number
    nationalityId: number
    genderId: number
    lastname: string
    firstname: string
    birthDate: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}