import { BookingViewModel } from "./booking-view-model"

export class BookingListResolved {

    constructor(public result: BookingViewModel, public error: any = null) { }

}
