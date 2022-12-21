import { DestinationViewModel } from './destination-view-model'

export interface DayVM {

    date: string
    pax?: number

    destinations: DestinationViewModel[]

}

