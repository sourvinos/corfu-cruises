import { ReservationGroupResource } from "../resources/reservation-group-resource"

export class ReservationListResolved {

    constructor(public result: ReservationGroupResource, public error: any = null) { }

}
