import { DestinationDropdownVM } from '../../../destinations/classes/view-models/destination-dropdown-vm'
import { PortDropdownVM } from '../../../ports/classes/view-models/port-dropdown-vm'

export class ScheduleReadVM {

    constructor(

        public id: number,
        public destination: DestinationDropdownVM,
        public port: PortDropdownVM,
        public date: string,
        public maxPassengers: number,
        public isActive: boolean

    ) { }

}