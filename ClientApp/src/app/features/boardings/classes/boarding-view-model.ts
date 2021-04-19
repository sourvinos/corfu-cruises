import { Driver } from "../../drivers/classes/driver"
import { Boarding } from "./boarding"

export class BoardingViewModel {

    allPersons: number
    boardedPersons: number
    remainingPersons: number
    totalPersons: number
    
    driver: Driver

    boardings: Boarding[] = []

}
