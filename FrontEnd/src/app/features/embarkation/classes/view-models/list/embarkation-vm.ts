import { EmbarkationPassenger } from './embarkation-passenger-vm'

export interface EmbarkationVM {

    refNo: string
    ticketNo: string
    remarks: string
    customerDescription: string
    destinationDescription: string
    driverDescription: string
    portDescription: string
    shipDescription: string
    totalPersons: number
    embarkedPassengers: number
    embarkationStatus: boolean
    isCheckedIn: string
    passengerIds: number[]

    passengers: EmbarkationPassenger[]

}
