import { IsTransferGroupViewModel } from './isTransferGroup-view-model'
import { ReservationsViewModel } from './reservation-view-model'

export class InvoicingViewModel {

    date: string
    customerDescription: string
    reservations: ReservationsViewModel[]
    isTransferGroup: IsTransferGroupViewModel[]
    totalPersons:number

}
