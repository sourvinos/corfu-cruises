import { Guid } from 'guid-typescript'
// Custom
import { PassengerWriteVM } from './passenger-write-vm'

export class ReservationWriteVM {

    constructor(

        public reservationId: Guid,
        public customerId: number,
        public destinationId: number,
        public pickupPointId: number,
        public portId: number,
        public date: string,
        public refNo: string,
        public ticketNo: string,
        public email: string,
        public phones: string,
        public adults: number,
        public kids: number,
        public free: number,
        public remarks: string,
        public passengers: PassengerWriteVM[],
        public driverId?: number,
        public shipId?: number,

    ) { }

}
