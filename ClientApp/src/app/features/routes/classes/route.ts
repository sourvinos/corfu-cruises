import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'
import { Port } from 'src/app/features/ports/classes/models/port'

export class Route extends KeyValuePair {

    abbreviation: string
    description: string
    isActive: boolean
    isTransfer: boolean
    port: Port

}
