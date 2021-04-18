import { Driver } from "../../drivers/classes/driver"
import { Boarding } from "./boarding"

export class BoardingViewModel {

    allPersons: number
    boardedPersons: number
    remainingPersons: number

    drivers: Driver[] = []

    boardings: Boarding[] = []

}
