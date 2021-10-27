import { PortResource } from './port-resource'

export class DestinationResource {

    id: number
    description: string
    passengerCount: number
    availableSeats: number

    ports: PortResource[]

}

