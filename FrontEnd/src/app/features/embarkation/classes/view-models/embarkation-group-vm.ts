import { EmbarkationVM } from './embarkation-vm'

export class EmbarkationGroupVM {

    constructor(

        public passengerCount: number,
        public boardedCount: number,
        public remainingCount: number,

        public embarkation: EmbarkationVM[] = []

    ) { }

}
