import { CustomerResource } from './customer-resource'
import { IsTransferGroupViewModel } from './isTransferGroup-view-model'
import { ReservationsViewModel } from './reservation-view-model'

export class InvoicingViewModel {

    date: string
    customerResource: CustomerResource
    reservations: ReservationsViewModel[]
    isTransferGroup: IsTransferGroupViewModel[]
    isTransferGroupTotal: IsTransferGroupViewModel

}
