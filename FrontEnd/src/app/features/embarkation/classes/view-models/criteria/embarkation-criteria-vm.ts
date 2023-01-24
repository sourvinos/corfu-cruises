import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface EmbarkationCriteriaVM {

    fromDate: string
    toDate: string
    destinations: SimpleEntity[]
    allDestinationsCheckbox: boolean
    ports: SimpleEntity[]
    allPortsCheckbox: boolean
    ships: SimpleEntity[]
    allShipsCheckbox: boolean

}