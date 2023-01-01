import { CustomerActiveVM } from 'src/app/features/customers/classes/view-models/customer-active-vm'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'

export interface LedgerCriteriaVM {

    fromDate: string,
    toDate: string,
    customers: CustomerActiveVM[],
    destinations: DestinationActiveVM[],
    ships: ShipActiveVM[]

}