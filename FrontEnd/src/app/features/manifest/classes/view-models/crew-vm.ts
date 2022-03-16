import { GenderAutocompleteVM } from 'src/app/features/genders/classes/view-models/gender-autocomplete-vm'
import { NationalityAutocompleteVM } from 'src/app/features/nationalities/classes/view-models/nationality-autocomplete-vm'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'

export class CrewVM {

    constructor(

        public id: number,
        public gender: GenderAutocompleteVM,
        public nationality: NationalityAutocompleteVM,
        public ship: ShipDropdownVM,
        public lastname: string,
        public firstname: string,
        public birthdate: string,
        public isActive: boolean,
        public genderDescription: string,
        public nationalityDescription: string,
        public occupantDescription: string

    ) { }

}
