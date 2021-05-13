import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

export class ShipRoute extends KeyValuePair {

    description: string
    from: string
    via: string
    to: string
    isActive: boolean

}
