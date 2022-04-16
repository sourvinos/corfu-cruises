import { InvoicingReservationVM } from './invoicing-reservation-vm'
import { InvoicingPortVM } from './invoicing-port-vm'

export class InvoicingVM {

    constructor(

        public customer: string,
        public portGroup: InvoicingPortVM[] = [],
        public reservations: InvoicingReservationVM[] = [],

    ) { }

}
