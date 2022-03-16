export class PickupPointWriteVM {

    constructor(

        public id: number,
        public routeId: number,
        public description: string,
        public exactPoint: string,
        public time: string,
        public coordinates: string,
        public isActive: boolean

    ) { }

}
