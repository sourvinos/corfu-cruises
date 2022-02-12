import { Customer } from '../../customers/classes/models/customer'

export class User {

    id: string
    userName: string
    displayName: string
    customer: Customer
    email: string
    isAdmin: boolean
    isActive: boolean

}
