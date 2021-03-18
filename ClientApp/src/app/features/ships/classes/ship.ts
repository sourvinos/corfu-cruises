import { KeyValuePair } from '../../../shared/classes/keyValuePair'

export class Ship extends KeyValuePair {

    description: string
    imo: string
    flag: string
    registryNo: string
    maxPersons: number
    isActive: boolean

}
