import { ShipOwnerDropdownVM } from './../../../shipOwners/classes/view-models/shipOwner-dropdown-vm'
export interface ShipReadDto {

    id: number
    shipOwner: ShipOwnerDropdownVM
    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

}
