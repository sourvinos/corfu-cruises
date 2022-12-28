import { CustomerVM } from './customer-vm'

export interface LedgerCriteriaVM {

    fromDate: string,
    toDate: string,
    customer: CustomerVM,
    destination: string,
    ship: string

}