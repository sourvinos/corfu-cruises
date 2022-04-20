import { GenericResource } from './../resources/generic-resource'

export class InvoicingCriteriaVM {

    constructor(

        public date: string,
        public customer: GenericResource,
        public destination: string,
        public ship: string

    ) { }

}