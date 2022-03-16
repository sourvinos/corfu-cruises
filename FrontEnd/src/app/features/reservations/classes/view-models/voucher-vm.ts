import { VoucherPassengerVM } from './voucher-passenger-vm'

export class VoucherVM {

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
    passengers: VoucherPassengerVM[]
    adults: string
    kids: string
    free: string
    totalPersons: string
    validPassengerIcon: string

}