import { LedgerDestinationVM } from './ledger-destination-vm'
import { LedgerPortVM } from './ledger-port-vm'
import { LedgerShipVM } from './ledger-ship-vm'

export interface LedgerReservationVM {

    date: string
    refNo: string
    reservationId: string
    destination: LedgerDestinationVM
    ship: LedgerShipVM
    port: LedgerPortVM
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