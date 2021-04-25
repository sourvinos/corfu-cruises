import { InvoicingViewModel } from "../view-models/invoicing-view-model"

export class InvoicingListResolved {

    constructor(public result: InvoicingViewModel, public error: any = null) { }

}
