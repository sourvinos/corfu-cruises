import { ShipDropdownVM } from '../../../ships/classes/view-models/ship-dropdown-vm'

export class RegistrarReadVM {

    constructor(

        public id: number,
        public ship: ShipDropdownVM,
        public fullname: string,
        public phones: string,
        public email: string,
        public fax: string,
        public address: string,
        public isPrimary: boolean,
        public isActive: boolean

    ) { }

}
