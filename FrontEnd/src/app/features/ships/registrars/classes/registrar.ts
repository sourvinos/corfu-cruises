import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'
import { ShipDropdownResource } from './../../../reservations/classes/resources/form/dropdown/ship-dropdown-resource'

export class Registrar extends KeyValuePair {

    fullname: string
    phones: string
    email: string
    fax: string
    address: string
    isPrimary: boolean
    isActive: boolean
    ship: ShipDropdownResource

}
