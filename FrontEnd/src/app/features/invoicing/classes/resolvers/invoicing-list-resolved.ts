import { InvoicingVM } from '../view-models/invoicing-vm'

export class InvoicingListResolved {

    constructor(public result: InvoicingVM, public error: any = null) { }

}
