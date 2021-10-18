import { Guid } from 'guid-typescript'

export class PassengerWriteResource {

    id: number
    reservationId: Guid
    occupantId: number
    nationalityId: number
    genderId: number
    lastname: string
    firstname: string
    birthdate: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}