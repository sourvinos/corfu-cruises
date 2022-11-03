import { PortActiveVM } from '../../../ports/classes/view-models/port-dropdown-vm'

export interface CoachRouteReadDto {

    id: number
    port: PortActiveVM
    abbreviation: string
    description: string
    hasTransfer: boolean
    isActive: boolean

}
