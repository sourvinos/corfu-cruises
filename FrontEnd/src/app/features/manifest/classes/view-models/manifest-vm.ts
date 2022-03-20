import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'
import { ManifestShipRouteVM } from './manifest-shipRoute-vm'

export class ManifestVM {

    constructor(

        public date: string,
        public ship: ManifestShipVM,
        public shipRoute: ManifestShipRouteVM,
        public passengers: ManifestPassengerVM[] = []

    ) { }

}
