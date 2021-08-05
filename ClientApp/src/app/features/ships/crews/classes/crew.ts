import { KeyValuePair } from 'src/app/shared/classes/keyValuePair'

export class Crew extends KeyValuePair {

    lastname: string
    firstname: string
    birthdate: string
    ship: {
        id: number
        description: string
    }
    nationality: {
        id: number
        description: string
    }
    gender: {
        id: number
        description: string
    }
    isActive: boolean

}
