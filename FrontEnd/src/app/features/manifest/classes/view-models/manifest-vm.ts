import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'
import { ManifestShipRouteVM } from './manifest-shipRoute-vm'

export interface ManifestVM {

    date: string
    destination: string
    port: string
    ship: ManifestShipVM
    shipRoute: ManifestShipRouteVM
    passengers: ManifestPassengerVM[]

}
