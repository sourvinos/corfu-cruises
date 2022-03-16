import { Guid } from 'guid-typescript'
// Custom
import { CustomerDropdownVM } from '../../../../../customers/classes/view-models/customer-dropdown-vm'
import { DestinationDropdownVM } from '../../../../../destinations/classes/view-models/destination-dropdown-vm'
import { DriverDropdownVM } from '../../../../../drivers/classes/view-models/driver-dropdown-vm'
import { PassengerReadVM } from '../../../view-models/passenger-read-vm'
import { PickupPointDropdownVM } from '../../../../../pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { PortDropdownVM } from 'src/app/features/ports/classes/view-models/port-dropdown-vm'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'

export class ReservationReadVM {

    reservationId: Guid
    customer: CustomerDropdownVM
    destination: DestinationDropdownVM
    driver: DriverDropdownVM
    pickupPoint: PickupPointDropdownVM
    port: PortDropdownVM
    ship: ShipDropdownVM
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
    passengers: PassengerReadVM

}

