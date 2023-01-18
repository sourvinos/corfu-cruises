import { ManifestDestinationVM } from './manifest-destination-vm'
import { ManifestPortVM } from './manifest-port-vm'
import { ManifestShipVM } from './manifest-ship-vm'

export interface ManifestCriteriaVM {

    fromDate: string
    toDate: string
    destinations: ManifestDestinationVM[]
    ships: ManifestShipVM[]
    ports: ManifestPortVM[]

}