import { CustomerVM } from './ledger-customer-vm'
import { LedgerPortGroupVM } from './ledger-port-group-vm'
import { LedgerReservationVM } from './ledger-reservation-vm'

export interface LedgerVM {

    customer: CustomerVM
    ports: LedgerPortGroupVM[]
    reservations: LedgerReservationVM[]

}
