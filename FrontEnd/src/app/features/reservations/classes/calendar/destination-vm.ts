import { PortVM } from './port-vm'

export class DestinationVM {

    constructor(

        public id: number,
        public description: string,
        public passengerCount: number,
        public availableSeats: number,
        public ports: PortVM[]

    ) { }

}

