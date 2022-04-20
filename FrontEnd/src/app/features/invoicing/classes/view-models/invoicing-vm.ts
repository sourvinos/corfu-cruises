import { GenericResource } from './../resources/generic-resource'
import { InvoicingReservationVM } from './invoicing-reservation-vm'
import { InvoicingPortVM } from './invoicing-port-vm'

export class InvoicingVM {

    constructor(

        public customer: GenericResource,
        public portGroup: InvoicingPortVM[] = [],
        public reservations: InvoicingReservationVM[] = [],

    ) { }

}
