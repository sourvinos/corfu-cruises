import { CustomerVM } from './customer-vm'

export interface InvoicingCriteriaVM {

    fromDate: string,
    toDate: string,
    customer: CustomerVM,
    destination: string,
    ship: string

}