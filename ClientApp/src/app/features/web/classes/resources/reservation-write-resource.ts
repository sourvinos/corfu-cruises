import { Guid } from "guid-typescript"

export class ReservationWriteResource {

    constructor(public reservationId: Guid, public date: string) { }
    
}

