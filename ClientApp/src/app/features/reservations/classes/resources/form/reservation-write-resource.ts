import { Guid } from "guid-typescript"

export class ReservationWriteResource {

    constructor(
        public reservationId: Guid,
        public date: string)
    // public destinationId: number,
    // public customerId: number,
    // public pickupPointId: number,
    // public portId: number,
    // public driverId: number,
    // public shipId: number
    // public ticketNo: string,
    // public email: string,
    // public phones: string,
    // public adults: number,
    // public kids: number,
    // public free: number,
    // public remarks: string,
    // public guid: string,
    // public userId: string,
    // public passengers: PassengerWriteResource[])
    { }
}

