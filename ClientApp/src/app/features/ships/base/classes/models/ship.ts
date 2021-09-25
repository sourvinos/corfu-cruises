import { KeyValuePair } from '../../../../../shared/classes/keyValuePair'
import { Registrar } from '../../../registrars/classes/registrar'
import { ShipOwner } from '../../../owners/classes/base/ship-owner'
import { Crew } from '../../../crews/classes/crew'

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

    registrars: Registrar[] = []
    crew: Crew[] = []

}