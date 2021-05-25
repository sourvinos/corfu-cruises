import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

export class ShipRoute extends KeyValuePair {

    description: string
    fromPort: string
    fromTime: string
    viaPort: string
    viaTime: string
    toPort: string
    toTime: string
    isActive: boolean

}
