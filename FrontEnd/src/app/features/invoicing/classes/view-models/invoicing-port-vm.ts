export interface InvoicingPortVM {

    port: string,
    hasTransferGroup: HasTransferGroupVM[],
    adults: number,
    kids: number,
    free: number,
    totalPersons: number,
    totalPassengers: number

}

export interface HasTransferGroupVM {

    hasTransfer: boolean,
    adults: number,
    kids: number,
    free: number,
    totalPersons: number,
    totalPassengers: number

}