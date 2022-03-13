import { Port } from 'src/app/features/ports/classes/models/port'

export class Route {

    id: number
    abbreviation: string
    description: string
    isActive: boolean
    hasTransfer: boolean
    port: Port

}
