import { ReportHeaderVM } from './report-header-vm'
import { ReportReservationVM } from './report-reservation-vm'

export class DriverReportVM {

    constructor(

        public header: ReportHeaderVM,
        public reservations: ReportReservationVM[]

    ) { }

}
