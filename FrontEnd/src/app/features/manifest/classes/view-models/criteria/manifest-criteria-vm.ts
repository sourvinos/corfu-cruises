import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ManifestCriteriaVM {

    fromDate: string
    toDate: string
    destinations: SimpleEntity[]
    ships: SimpleEntity[]
    ports: SimpleEntity[]

}