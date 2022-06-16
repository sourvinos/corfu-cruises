import { GenericResource } from '../resources/generic-resource'
import { TotalsPortVM } from './totals-port-vm'
import { TotalsReservationVM } from './totals-reservation-vm'

export class TotalsVM {

    constructor(

        public customer: GenericResource,
        public portGroup: TotalsPortVM[] = [],
        public reservations: TotalsReservationVM[] = [],

    ) { }

}
