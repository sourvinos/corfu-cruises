import { ReservationListDto } from './reservation-list-dto'

export interface ReservationGroupDto {

    persons: number
    
    reservations: ReservationListDto[]

}
