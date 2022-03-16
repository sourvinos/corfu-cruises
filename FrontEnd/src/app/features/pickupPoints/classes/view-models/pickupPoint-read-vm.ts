import { RouteDropdownVM } from './../../../routes/classes/view-models/route-dropdown-vm'

export class PickupPointReadVM {

    constructor(

        public id: number,
        public description: string,
        public route: RouteDropdownVM,
        public exactPoint: string,
        public time: string,
        public coordinates: string,
        public isActive: boolean

    ) { }

}
