import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

export class Schedule extends KeyValuePair {

    date: string
    port: {
        id: number
        description: string
    }
    destination: {
        id: number
        description: string
    }
    maxPersons: number
    isActive: boolean

}