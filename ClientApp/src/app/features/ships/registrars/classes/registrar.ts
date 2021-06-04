import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'
import { Ship } from '../../base/classes/ship'

export class Registrar extends KeyValuePair {

    fullname: string
    shipId: number
    shipDescription: string
    phones: string
    email: string
    fax: string
    address: string
    isPrimary: boolean
    isActive: boolean

}
