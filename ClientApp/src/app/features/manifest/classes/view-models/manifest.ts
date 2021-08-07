import { Guid } from "guid-typescript"
import { ManifestPassenger } from "./manifest-passenger"

export class Manifest {

    reservationId: Guid
    ticketNo: string
    totalPersons: number
    customer: string
    driver: string
    remarks: string
    isBoarded: string


    passengers: ManifestPassenger[]

}
