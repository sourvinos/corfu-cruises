import { EmbarkationReservationVM } from './embarkation-reservation-vm'

export class EmbarkationVM {

    constructor(

        public passengerCount: number,
        public passengerCountWithNames: number,
        public boardedCount: number,
        public remainingCount: number,
        public passengerCountWithNoNames: number,
        public embarkation: EmbarkationReservationVM[] = []

    ) { }

}
