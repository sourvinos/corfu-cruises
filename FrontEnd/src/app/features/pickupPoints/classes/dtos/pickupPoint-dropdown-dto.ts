import { PortDropdownDTO } from 'src/app/features/ports/classes/dtos/port-dropdown-dto'

export class PickupPointDropdownDTO {

    id: number
    description: string
    exactPoint: string
    time: string
    
    port: PortDropdownDTO

}
