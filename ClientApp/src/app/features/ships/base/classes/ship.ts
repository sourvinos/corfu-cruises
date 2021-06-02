import { KeyValuePair } from '../../../../shared/classes/keyValuePair'
import { DataEntryPerson } from '../../../dataentrypersons/classes/dataEntryPerson'
import { ShipOwner } from '../../owners/classes/ship-owner'

export class Ship extends KeyValuePair {

    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

    shipOwner: ShipOwner

    dataEntryPersons: DataEntryPerson[] = []

}
