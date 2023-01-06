import { DestinationVM } from './destination-vm'
import { ShipVM } from './ship-vm'

export interface LedgerReservationVM {

    date: string
    refNo: string
    reservationId: string
    destination: DestinationVM
    ship: ShipVM
    port: string
    ticketNo: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    embarkedPassengers: number
    totalNoShow: number
    remarks: string
    hasTransfer: boolean

}