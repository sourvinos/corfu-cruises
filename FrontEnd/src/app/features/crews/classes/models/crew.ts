export class Crew {

    id: number
    lastname: string
    firstname: string
    birthdate: string

    gender: {
        id: number
        description: string
    }
    nationality: {
        id: number
        description: string
    }
    ship: {
        id: number
        description: string
    }
    isActive: boolean
    genderDescription: string
    nationalityDescription: string
    occupantDescription: string

}
