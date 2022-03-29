import { PortDropdownVM } from '../../../ports/classes/view-models/port-dropdown-vm'

export class CoachRouteReadDTO {

    constructor(

        public id: number,
        public port: PortDropdownVM,
        public abbreviation: string,
        public description: string,
        public hasTransfer: boolean,
        public isActive: boolean,

    ) { }

}
