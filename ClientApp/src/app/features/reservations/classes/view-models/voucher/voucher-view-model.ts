import { VoucherPassenger } from './voucher-passenger'

export class VoucherViewModel {

    date: string
    destinationDescription: string
    pickupPointDescription: string
    pickupPointExactPoint: string
    pickupPointTime: string
    remarks: string
    qrcode: string
    passengers: VoucherPassenger[]

}