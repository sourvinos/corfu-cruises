import { Guid } from 'guid-typescript'

export class PassengerWriteVM {

    id: number
    reservationId: Guid
    genderId: number
    nationalityId: number
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}