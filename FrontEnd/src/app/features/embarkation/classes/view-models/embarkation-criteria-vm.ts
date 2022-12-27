import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { PortActiveVM } from './../../../ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from './../../../ships/classes/view-models/ship-active-vm'

export interface EmbarkationCriteriaVM {

    date: string,
    destinations: DestinationActiveVM[]
    ports: PortActiveVM[]
    ships: ShipActiveVM[]

}