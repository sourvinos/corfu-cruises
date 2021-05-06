// Custom
import { Boarding } from "./boarding"

export class BoardingCompositeViewModel {

    passengers: number
    boarded: number
    remaining: number
    totalPersons: number
    missingNames: number

    boardings: Boarding[] = []

}
