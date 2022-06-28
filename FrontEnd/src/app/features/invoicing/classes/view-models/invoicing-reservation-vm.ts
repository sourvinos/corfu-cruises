export interface InvoicingReservationVM {

    reservationId: string,
    destination: string,
    ship: string,
    port: string,
    ticketNo: string,
    adults: number,
    kids: number,
    free: number,
    totalPersons: number,
    embarkedPassengers: number,
    totalNoShow: number,
    remarks: string,
    hasTransfer: boolean

}