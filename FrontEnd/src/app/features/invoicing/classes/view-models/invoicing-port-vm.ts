export class InvoicingPortVM {

    constructor(

        public port: string,
        public hasTransferGroup: HasTransferGroupVM[],
        public adults: number,
        public kids: number,
        public free: number,
        public totalPersons: number,
        public totalPassengers: number

    ) { }

}

export class HasTransferGroupVM {

    constructor(

        public hasTransfer: boolean,
        public adults: number,
        public kids: number,
        public free: number,
        public totalPersons: number,
        public totalPassengers: number

    ) { }

}