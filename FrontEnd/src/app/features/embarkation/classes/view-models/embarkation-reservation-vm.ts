import { Guid } from 'guid-typescript'
import { EmbarkationPassenger } from './embarkation-passenger-vm'

export class EmbarkationReservationVM {

    reservationId: Guid
    refNo: string
    ticketNo: string
    totalPersons: number
    customer: string
    driver: string
    ship: string
    remarks: string
    isCheckedIn: string
    passengerIds: number[]

    passengers: EmbarkationPassenger[]

}
