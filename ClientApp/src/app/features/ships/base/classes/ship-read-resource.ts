import { KeyValuePair } from '../../../../shared/classes/keyValuePair'

export class ShipReadResource extends KeyValuePair {

    description: string
    shipOwnerId: number
    shipOwnerDescription: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

}
