import { Guid } from 'guid-typescript'
import { ManifestPassengerVM } from './manifest-passenger-vm'

export class ManifestVM {

    constructor(

        public reservationId: Guid,
        public ticketNo: string,
        public totalPersons: number,
        public customer: string,
        public driver: string,
        public remarks: string,
        public isBoarded: string,
        public passengers: ManifestPassengerVM[]

    ) { }

}
