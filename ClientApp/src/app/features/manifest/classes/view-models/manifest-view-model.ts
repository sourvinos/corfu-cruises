import { Ship } from 'src/app/features/ships/classes/ship'
import { ManifestPassenger } from './manifest-passenger'

export class ManifestViewModel {

    date: string
    route: string
    ship: Ship

    passengers: ManifestPassenger[] = []

}
