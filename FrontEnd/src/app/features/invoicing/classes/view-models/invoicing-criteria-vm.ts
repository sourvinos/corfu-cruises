import { CustomerVM } from './customer-vm'

export interface InvoicingCriteriaVM {

    date: string,
    customer: CustomerVM,
    destination: string,
    ship: string

}