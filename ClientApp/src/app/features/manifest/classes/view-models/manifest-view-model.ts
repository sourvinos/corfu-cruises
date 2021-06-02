import { Ship } from 'src/app/features/ships/base/classes/ship'
import { ManifestPassenger } from './manifest-passenger'

export class ManifestViewModel {

    date: string
    route: string
    ship: Ship

    passengers: ManifestPassenger[] = []

}
