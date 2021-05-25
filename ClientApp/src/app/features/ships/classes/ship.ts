import { KeyValuePair } from '../../../shared/classes/keyValuePair'
import { DataEntryPerson } from '../../dataentrypersons/classes/dataEntryPerson'

export class ShipOwner {

    description: string
    profession: string
    address: string
    city: string
    phones: string
    taxNo: string

}

export class Ship extends KeyValuePair {

    description: string
    imo: string
    flag: string
    registryNo: string
    maxPersons: number
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

    shipOwner: ShipOwner

    dataEntryPersons: DataEntryPerson[] = []

}
