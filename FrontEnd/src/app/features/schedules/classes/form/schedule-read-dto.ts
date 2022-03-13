import { DestinationDropdownDTO } from './../../../destinations/classes/dtos/destination-dropdown-dto'
import { PortDropdownDTO } from './../../../ports/classes/dtos/port-dropdown-dto'

export class ScheduleReadDTO {

    id: number
    destination: DestinationDropdownDTO
    port: PortDropdownDTO
    date: string
    maxPassengers: number
    isActive: boolean

}