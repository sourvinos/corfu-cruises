import { Guid } from "guid-typescript"
// Custom
import { CustomerDropdownResource } from "../dropdown/customer-dropdown-resource"
import { DestinationDropdownResource } from '../dropdown/destination-dropdown-resource'
import { DriverDropdownResource } from '../dropdown/driver-dropdown-resource'
import { PassengerReadResource } from "../passenger/passenger-read-resource"
import { PickupPointDropdownResource } from '../dropdown/pickupPoint-dropdown-resource'
import { PortDropdownResource } from '../dropdown/port-dropdown-resource'
import { ShipDropdownResource } from '../dropdown/ship-dropdown-resource'

export class ReservationReadResource {

    reservationId: Guid

    date: string
    email: string
    phones: string
    remarks: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string

    customer: CustomerDropdownResource
    destination: DestinationDropdownResource
    pickupPoint: PickupPointDropdownResource
    driver: DriverDropdownResource
    ship: ShipDropdownResource
    port: PortDropdownResource

    passengers: PassengerReadResource

}

