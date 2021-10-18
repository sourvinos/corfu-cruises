import { VoucherPassenger } from './voucher-passenger'

export class VoucherViewModel {

    date: string
    ticketNo: string
    destinationDescription: string
    customerDescription: string
    pickupPointDescription: string
    pickupPointExactPoint: string
    pickupPointTime: string
    driverDescription: string
    remarks: string
    qr: string
    passengers: VoucherPassenger[]
    adults: string
    kids: string
    free: string
    totalPersons: string
    validPassengerIcon: string

}