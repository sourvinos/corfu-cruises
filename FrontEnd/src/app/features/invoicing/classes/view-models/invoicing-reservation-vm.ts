export class InvoicingReservationVM {

    constructor(

        public reservationId: string,
        public destination: string,
        public ship: string,
        public port: string,
        public ticketNo: string,
        public adults: number,
        public kids: number,
        public free: number,
        public totalPersons: number,
        public embarkedPassengers: number,
        public totalNoShow: number,
        public remarks: string,
        public hasTransfer: boolean

    ) { }

}