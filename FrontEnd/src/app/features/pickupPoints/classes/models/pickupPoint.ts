export class PickupPoint {

    id: number
    description: string
    route: {
        id: number
        abbreviation: string
        description: string
    }
    exactPoint: string
    time: string
    coordinates: string
    isActive: boolean

}
