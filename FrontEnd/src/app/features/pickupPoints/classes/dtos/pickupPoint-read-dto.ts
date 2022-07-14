import { CoachRouteDropdownVM } from '../../../coachRoutes/classes/view-models/coachRoute-dropdown-vm'

export interface PickupPointReadDto {

    id: number
    description: string
    coachRoute: CoachRouteDropdownVM
    exactPoint: string
    time: string
    coordinates: string
    isActive: boolean

}
