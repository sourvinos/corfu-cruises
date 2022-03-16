export class ReportReservationVM {

    constructor(

        public time: string,
        public ticketNo: string,
        public pickupPointDescription: string,
        public exactPoint: string,
        public adults: number,
        public kids: number,
        public free: number,
        public totalPersons: number,
        public customerDescription: string,
        public fullname: string,
        public remarks: string,
        public destinationAbbreviation: string

    ) { }

}
