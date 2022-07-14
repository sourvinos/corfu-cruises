import { PortDropdownVM } from 'src/app/features/ports/classes/view-models/port-dropdown-vm'

export interface PickupPointDropdownVM {

    id: number
    description: string
    exactPoint: string
    time: string
    port: PortDropdownVM

}
