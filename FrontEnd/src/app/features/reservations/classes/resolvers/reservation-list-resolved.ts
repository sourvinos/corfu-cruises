import { ReservationGroupVM } from '../resources/list/reservation-group-vm'

export class ReservationListResolved {

    constructor(public result: ReservationGroupVM, public error: any = null) { }

}
