import { ShipOwnerDropdownVM } from 'src/app/features/shipOwners/classes/view-models/shipOwner-dropdown-vm'

export class ShipReadVM {

    constructor(

        public id: number,
        public shipOwner: ShipOwnerDropdownVM,
        public description: string,
        public imo: string,
        public flag: string,
        public registryNo: string,
        public manager: string,
        public managerInGreece: string,
        public agent: string,
        public isActive: boolean

    ) { }

}
