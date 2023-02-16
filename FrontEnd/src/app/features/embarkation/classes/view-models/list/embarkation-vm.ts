import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { EmbarkationPassengerVM } from './embarkation-passenger-vm'

export interface EmbarkationVM {

    refNo: string
    ticketNo: string
    customer: SimpleEntity
    destination: SimpleEntity
    pickupPoint: SimpleEntity
    driver: SimpleEntity
    port: SimpleEntity
    ship: SimpleEntity
    totalPersons: number
    embarkedPassengers: number
    embarkationStatus: boolean
    isCheckedIn: string
    remarks: string
    passengerIds: number[]

    passengers: EmbarkationPassengerVM[]

}
