import { PortDropdownVM } from '../../../ports/classes/view-models/port-dropdown-vm'

export interface CoachRouteReadDTO {

    id: number
    port: PortDropdownVM
    abbreviation: string
    description: string
    hasTransfer: boolean
    isActive: boolean

}
