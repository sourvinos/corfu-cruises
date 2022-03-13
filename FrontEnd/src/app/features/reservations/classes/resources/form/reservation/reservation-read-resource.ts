import { Guid } from 'guid-typescript'
// Custom
import { CustomerDropdownDTO } from '../../../../../customers/classes/dtos/customer-dropdown-dto'
import { DestinationDropdownDTO } from '../../../../../destinations/classes/dtos/destination-dropdown-dto'
import { DriverDropdownDTO } from '../../../../../drivers/classes/dtos/driver-dropdown-dto'
import { PassengerReadResource } from '../passenger/passenger-read-resource'
import { PickupPointDropdownDTO } from '../../../../../pickupPoints/classes/dtos/pickupPoint-dropdown-dto'
import { ShipDropdownResource } from '../dropdown/ship-dropdown-resource'
import { PortDropdownDTO } from 'src/app/features/ports/classes/dtos/port-dropdown-dto'

export class ReservationReadResource {

    reservationId: Guid

    date: string
    refNo: string
    email: string
    phones: string
    remarks: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string

    customer: CustomerDropdownDTO
    destination: DestinationDropdownDTO
    pickupPoint: PickupPointDropdownDTO
    driver: DriverDropdownDTO
    ship: ShipDropdownResource
    port: PortDropdownDTO

    passengers: PassengerReadResource

}

