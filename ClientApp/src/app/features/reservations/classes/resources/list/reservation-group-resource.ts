import { ReservationListResource } from "./reservation-list-resource"

export class ReservationGroupResource {

    persons: number
    
    personsPerDestination: any[]
    personsPerCustomer: any[]
    personsPerRoute: any[]
    personsPerDriver: any[]
    personsPerPort: any[]
    personsPerShip: any[]
    
    reservations: ReservationListResource[]

}
