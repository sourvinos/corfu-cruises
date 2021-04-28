// Cutom
import { Boarding } from "./boarding"
import { Customer } from "../../customers/classes/customer"
import { Driver } from "../../drivers/classes/driver"

export class BoardingViewModel {

    allPersons: number
    boardedPersons: number
    remainingPersons: number
    totalPersons: number

    customer: Customer
    driver: Driver

    boardings: Boarding[] = []

}
