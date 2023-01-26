import { EmbarkationPassenger } from './embarkation-passenger-vm'

export interface EmbarkationVM {

    refNo: string
    ticketNo: string
    customerDescription: string
    destinationDescription: string
    pickupPointDescription: string
    driverDescription: string
    portDescription: string
    shipDescription: string
    totalPersons: number
    embarkedPassengers: number
    embarkationStatus: boolean
    isCheckedIn: string
    remarks: string
    passengerIds: number[]

    passengers: EmbarkationPassenger[]

}
