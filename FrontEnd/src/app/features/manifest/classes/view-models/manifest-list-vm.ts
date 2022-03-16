import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ShipVM } from './ship-vm'

export class ManifestListVM {

    constructor(

        public date: string,
        public ship: ShipVM,
        public route: string,
        public passengers: ManifestPassengerVM[] = []

    ) { }

}
