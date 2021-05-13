import { Guid } from "guid-typescript"

export class WebPassengerWriteResource {

    id: number
    reservationId: Guid
    occupantId: number
    nationalityId: number
    genderId: number
    lastname: string
    firstname: string
    dob: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}