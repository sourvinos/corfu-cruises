import { Guid } from 'guid-typescript'

export class UserWriteVM {

    id: Guid
    userName: string
    displayname: string
    customerId?: number
    email: string
    isAdmin: boolean
    isActive: boolean

}
