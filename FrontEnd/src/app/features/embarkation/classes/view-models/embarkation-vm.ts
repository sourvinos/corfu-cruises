import { Guid } from 'guid-typescript'
import { EmbarkationPassenger } from './embarkation-passenger-vm'

export class EmbarkationVM {

    reservationId: Guid
    refNo: string
    ticketNo: string
    remarks: string
    customer: string
    destination: string
    driver: string
    port: string
    ship: string
    totalPersons: number
    embarkedPassengers: number
    embarkationStatus: boolean
    isCheckedIn: string
    passengerIds: number[]

    passengers: EmbarkationPassenger[]

}
