import { Guid } from 'guid-typescript'
// Custom
import { GenderDropdownVM } from 'src/app/features/genders/classes/view-models/gender-dropdown-vm'
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'

export class PassengerReadVM {

    id: number
    reservationId: Guid
    gender: GenderDropdownVM
    nationality: NationalityDropdownVM
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}