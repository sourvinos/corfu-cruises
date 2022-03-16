import { EmbarkationReservationVM } from './embarkation-reservation-vm'

export class EmbarkationVM {

    constructor(

        public passengers: number,
        public boarded: number,
        public remaining: number,
        public totalPersons: number,
        public missingNames: number,
        public embarkation: EmbarkationReservationVM[] = []

    ) { }

}
