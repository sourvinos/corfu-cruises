import { GenericResource } from '../resources/generic-resource'
import { TotalsPortVM } from './simple-user-totals-port-vm'
import { TotalsReservationVM } from './simple-user-totals-reservation-vm'

export class TotalsVM {

    constructor(

        public customer: GenericResource,
        public portGroup: TotalsPortVM[] = [],
        public reservations: TotalsReservationVM[] = [],

    ) { }

}
