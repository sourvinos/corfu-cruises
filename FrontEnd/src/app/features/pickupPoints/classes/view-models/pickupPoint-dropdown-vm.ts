import { PortDropdownVM } from 'src/app/features/ports/classes/view-models/port-dropdown-vm'

export class PickupPointDropdownVM {


    constructor(

        public id: number,
        public description: string,
        public exactPoint: string,
        public time: string,
        public port: PortDropdownVM

    ) { }

}
