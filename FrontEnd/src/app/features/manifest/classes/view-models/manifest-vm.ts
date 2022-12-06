import { ManifestPassengerVM } from './manifest-passenger-vm'

export interface ManifestVM {

    date: string
    destination: string
    passengers: ManifestPassengerVM[]

}
