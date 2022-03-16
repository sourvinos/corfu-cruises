import { EmbarkationReservationVM } from '../view-models/embarkation-reservation-vm'

export class EmbarkationListResolved {

    constructor(public result: EmbarkationReservationVM, public error: any = null) { }

}
