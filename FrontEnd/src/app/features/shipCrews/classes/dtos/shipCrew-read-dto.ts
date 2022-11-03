import { GenderActiveVM } from 'src/app/features/genders/classes/view-models/gender-active-vm'
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'

export interface ShipCrewReadDto {

    id: number
    gender: GenderActiveVM
    nationality: NationalityDropdownVM
    ship: ShipDropdownVM
    lastname: string
    firstname: string
    birthdate: string
    isActive: boolean

}
