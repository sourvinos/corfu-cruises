import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'
import { ShipRoute } from './../../../../shipRoutes/classes/models/shipRoute'

export interface ManifestVM {

    date: string
    destination: string
    ship: ManifestShipVM
    shipRoute: ShipRoute
    passengers: ManifestPassengerVM[]

}
