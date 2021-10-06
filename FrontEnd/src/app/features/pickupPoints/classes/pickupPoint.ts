import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

export class PickupPoint extends KeyValuePair {

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
