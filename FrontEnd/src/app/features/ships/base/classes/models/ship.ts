import { Crew } from 'src/app/features/shipCrews/classes/models/crew'
import { Registrar } from '../../../registrars/classes/registrar'
import { ShipOwner } from '../../../owners/classes/base/ship-owner'

export class Ship {

    id: number
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
