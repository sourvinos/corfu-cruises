import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

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
