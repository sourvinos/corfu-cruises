import { CustomerVM } from './customer-vm'
import { LedgerPortVM } from './ledger-port-vm'
import { LedgerReservationVM } from './ledger-reservation-vm'

export interface LedgerVM {

    fromDate: string
    toDate: string
    customer: CustomerVM
    portGroup: LedgerPortVM[]
    reservations: LedgerReservationVM[]

}
