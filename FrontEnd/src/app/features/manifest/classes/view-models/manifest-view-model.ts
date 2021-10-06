import { Ship } from 'src/app/features/ships/base/classes/models/ship'
import { ManifestPassenger } from './manifest-passenger'

export class ManifestViewModel {

    date: string
    ship: Ship
    route: string

    passengers: ManifestPassenger[] = []

}
