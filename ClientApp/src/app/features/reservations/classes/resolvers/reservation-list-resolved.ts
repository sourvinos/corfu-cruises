import { ReservationGroupResource } from "../resources/list/reservation-group-resource"

export class ReservationListResolved {

    constructor(public result: ReservationGroupResource, public error: any = null) { }

}
