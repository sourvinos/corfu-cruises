import { PortDropdownDTO } from './../../../ports/classes/dtos/port-dropdown-dto'

export class RouteReadDTO {

    id: number
    port: PortDropdownDTO
    abbreviation: string
    description: string
    isActive: boolean
    hasTransfer: boolean

}
