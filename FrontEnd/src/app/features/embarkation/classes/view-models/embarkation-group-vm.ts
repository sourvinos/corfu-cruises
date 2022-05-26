import { EmbarkationVM } from './embarkation-vm'

export class EmbarkationGroupVM {

    constructor(

        public totalPersons: number,
        public embarkedPassengers: number,
        public pendingPersons: number,

        public reservations: EmbarkationVM[] = []

    ) { }

}
