import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface EmbarkationCriteriaVM {

    fromDate: string
    toDate: string
    destinations: SimpleEntity[]
    ports: SimpleEntity[]
    ships: SimpleEntity[]
    allDestinationsCheckbox: boolean
    allPortsCheckbox: boolean
    allShipsCheckbox: boolean

}