export class InvoicingReservationVM {

    constructor(

        public reservationId: string,
        public destinationDescription: string,
        public shipDescription: string,
        public portDescription: string,
        public ticketNo: string,
        public adults: number,
        public kids: number,
        public free: number,
        public totalPersons: number,
        public remarks: string,
        public hasTransfer: boolean

    ) { }

}