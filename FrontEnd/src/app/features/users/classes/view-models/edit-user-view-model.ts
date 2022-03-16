import { Guid } from 'guid-typescript'
// Custom
import { CustomerDropdownVM } from '../../../customers/classes/view-models/customer-dropdown-vm'

export class EditUserViewModel {

    id: Guid
    userName: string
    displayname: string
    customer: CustomerDropdownVM
    email: string
    isAdmin: boolean
    isActive: boolean

}
