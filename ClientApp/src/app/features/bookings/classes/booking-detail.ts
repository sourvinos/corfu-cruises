export class BookingDetail {

    id: number
    bookingId: number
    occupant: {
        id: number
        description: string
    }
    nationality: {
        id: number
        description: string
    }
    lastname: string
    firstname: string
    dob: string
    email: string
    phones: string
    specialCare: string
    remarks: string
    isCheckedIn: boolean

}