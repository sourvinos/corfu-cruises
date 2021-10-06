import { GenericResource } from '../resources/generic-resource'
import { InvoicingTransferGroupViewModel } from './invoicing-transfer-group-view-model'
import { ReservationViewModel } from './reservation-view-model'

export class InvoicingViewModel {

    date: string
    customerResource: GenericResource
    reservations: ReservationViewModel[]
    isTransferGroup: InvoicingTransferGroupViewModel[]
    isTransferGroupTotal: InvoicingTransferGroupViewModel

}
