import { CoachRouteDropdownVM } from './../../../coachRoutes/classes/view-models/coachRoute-dropdown-vm'

export class PickupPointReadVM {

    constructor(

        public id: number,
        public description: string,
        public route: CoachRouteDropdownVM,
        public exactPoint: string,
        public time: string,
        public coordinates: string,
        public isActive: boolean

    ) { }

}
