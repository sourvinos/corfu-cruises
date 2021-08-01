import { KeyValuePair } from '../../../../shared/classes/keyValuePair'
import { ShipOwnerResource } from './ship-owner-resource'

export class ShipReadResource extends KeyValuePair {

    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

    shipOwner: ShipOwnerResource

}
