import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'

export interface ManifestVM {

    date: string
    destination: string
    ship: ManifestShipVM
    passengers: ManifestPassengerVM[]

}
