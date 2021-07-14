import { Embarkation } from "./embarkation"

export class EmbarkationCompositeViewModel {

    passengers: number
    boarded: number
    remaining: number
    totalPersons: number
    missingNames: number

    embarkation: Embarkation[] = []

}
