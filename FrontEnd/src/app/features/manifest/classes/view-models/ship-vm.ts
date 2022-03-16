import { CrewVM } from 'src/app/features/manifest/classes/view-models/crew-vm'
import { Registrar } from 'src/app/features/registrars/classes/models/registrar'
import { ShipOwnerVM } from 'src/app/features/manifest/classes/view-models/shipOwner-vm'

export class ShipVM {

    constructor(

        public id: number,
        public description: string,
        public imo: string,
        public flag: string,
        public registryNo: string,
        public manager: string,
        public managerInGreece: string,
        public agent: string,
        public isActive: boolean,
        public shipOwner: ShipOwnerVM,
        public registrars: Registrar[] = [],
        public crew: CrewVM[] = []

    ) { }

}
