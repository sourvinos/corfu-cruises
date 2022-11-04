import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'

export class ScheduleReadVM {

    constructor(

        public id: number,
        public destination: DestinationActiveVM,
        public port: PortActiveVM,
        public date: string,
        public maxPassengers: number,
        public departureTime: string,
        public isActive: boolean

    ) { }

}