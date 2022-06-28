import { CustomerVM } from './customer-vm'
import { InvoicingPortVM } from './invoicing-port-vm'
import { InvoicingReservationVM } from './invoicing-reservation-vm'

export interface InvoicingVM {

    customer: CustomerVM,
    portGroup: InvoicingPortVM[],
    reservations: InvoicingReservationVM[],

}
