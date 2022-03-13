import { ShipOwnerDropdownDTO } from 'src/app/features/shipOwners/classes/dtos/shipOwner-dropdown-dto'

export class ShipReadDTO {

    id: number
    shipOwner: ShipOwnerDropdownDTO
    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

}
