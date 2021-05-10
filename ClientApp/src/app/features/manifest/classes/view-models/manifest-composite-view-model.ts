// Custom

import { Manifest } from "./manifest"

export class ManifestCompositeViewModel {

    passengers: number
    boarded: number
    remaining: number
    totalPersons: number
    missingNames: number

    manifests: Manifest[] = []

}
