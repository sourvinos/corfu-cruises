import { ReportHeaderVM } from './report-header-vm'
import { ReportReservationVM } from './report-reservation-vm'

export interface DriverReportVM {

    header: ReportHeaderVM
    reservations: ReportReservationVM[]

}
