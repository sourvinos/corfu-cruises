import { Crew } from 'src/app/features/crews/classes/models/crew'
import { Registrar } from 'src/app/features/registrars/classes/models/registrar'
import { ShipOwner } from 'src/app/features/shipOwners/classes/models/shipOwner'

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
