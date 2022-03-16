import { Guid } from 'guid-typescript'
// Custom
import { GenderAutocompleteVM } from 'src/app/features/genders/classes/view-models/gender-autocomplete-vm'
import { NationalityAutocompleteVM } from 'src/app/features/nationalities/classes/view-models/nationality-autocomplete-vm'

export class PassengerReadVM {

    id: number
    reservationId: Guid
    gender: GenderAutocompleteVM
    nationality: NationalityAutocompleteVM
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}