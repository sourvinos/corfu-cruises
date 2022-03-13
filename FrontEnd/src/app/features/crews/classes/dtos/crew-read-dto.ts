export class CrewReadDTO {

    id: number
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
    lastname: string
    firstname: string
    birthdate: string
    isActive: boolean

}
