import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ManifestCriteriaVM {

    fromDate: string
    toDate: string
    destinations: SimpleEntity[]
    ports: SimpleEntity[]
    ships: SimpleEntity[]
    allPortsCheckbox: boolean

}