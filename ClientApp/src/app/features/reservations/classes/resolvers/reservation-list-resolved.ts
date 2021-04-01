import { ReservationViewModel } from "../view-models/reservation-view-model"

export class ReservationListResolved {

    constructor(public result: ReservationViewModel, public error: any = null) { }

}
