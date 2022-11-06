import { PortViewModel } from './port-view-model'

export class DestinationViewModel {

    id: number
    description: string
    abbreviation: string
    passengerCount: number
    availableSeats: number

    ports: PortViewModel[]

}

