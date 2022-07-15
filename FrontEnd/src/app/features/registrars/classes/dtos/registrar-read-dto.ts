import { ShipDropdownVM } from '../../../ships/classes/view-models/ship-dropdown-vm'

export interface RegistrarReadDto {

    id: number
    ship: ShipDropdownVM
    fullname: string
    phones: string
    email: string
    fax: string
    address: string
    isPrimary: boolean
    isActive: boolean

}
