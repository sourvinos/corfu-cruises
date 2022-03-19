import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'

export class ManifestVM {

    constructor(

        public date: string,
        public ship: ManifestShipVM,
        public route: string,
        public passengers: ManifestPassengerVM[] = []

    ) { }

}
