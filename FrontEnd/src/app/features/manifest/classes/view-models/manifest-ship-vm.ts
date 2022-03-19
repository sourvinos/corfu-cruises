import { ManifestCrewVM } from './manifest-crew-vm'
import { ManifestRegistrarVM } from './manifest-registrar-vm'
import { ManifestShipOwnerVM } from 'src/app/features/manifest/classes/view-models/manifest-shipOwner-vm'

export class ManifestShipVM {

    constructor(

        public description: string,
        public imo: string,
        public flag: string,
        public registryNo: string,
        public manager: string,
        public managerInGreece: string,
        public agent: string,
        public shipOwner: ManifestShipOwnerVM,
        public registrars: ManifestRegistrarVM[] = [],
        public crew: ManifestCrewVM[] = []

    ) { }

}
