import { ManifestGenderVM } from './manifest-gender-vm'
import { ManifestNationalityVM } from './manifest-nationality-vm'
import { ManifestOccupantVM } from './manifest-occupant-vm'

export interface ManifestShipCrewVM {

    lastname: string
    firstname: string
    birthdate: string
    gender: ManifestGenderVM,
    nationality: ManifestNationalityVM,
    occupant: ManifestOccupantVM,
    remarks: string
    specialCare: string

}