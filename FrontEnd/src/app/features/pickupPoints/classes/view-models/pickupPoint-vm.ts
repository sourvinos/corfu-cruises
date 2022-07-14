import { CoachRouteVM } from '../view-models/coachRoute-vm'

export interface PickupPointVM {

    id: number
    description: string
    coachRoute: CoachRouteVM
    exactPoint: string
    time: string
    coordinates: string
    isActive: boolean

}
