import { PortDropdownVM } from '../../../ports/classes/view-models/port-dropdown-vm'

export class RouteReadDTO {

    constructor(

        public id: number,
        public port: PortDropdownVM,
        public abbreviation: string,
        public description: string,
        public isActive: boolean,
        public hasTransfer: boolean

    ) { }

}
