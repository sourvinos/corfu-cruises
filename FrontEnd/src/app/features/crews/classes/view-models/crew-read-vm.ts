import { GenderDropdownVM } from 'src/app/features/genders/classes/view-models/gender-dropdown-vm'
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'

export class CrewReadVM {

    constructor(

        public id: number,
        public gender: GenderDropdownVM,
        public nationality: NationalityDropdownVM,
        public ship: ShipDropdownVM,
        public lastname: string,
        public firstname: string,
        public birthdate: string,
        public isActive: boolean

    ) { }

}
