import { GenericResource } from '../resources/generic-resource'
import { InvoicingTransferGroupVM } from './invoicing-transfer-group-vm'
import { InvoicingReservationVM } from './invoicing-reservation-vm'

export class InvoicingVM {

    constructor(

        public date: string,
        public customerResource: GenericResource,
        public reservations: InvoicingReservationVM[],
        public hasTransferGroup: InvoicingTransferGroupVM[],
        public hasTransferGroupTotal: InvoicingTransferGroupVM

    ) { }

}
