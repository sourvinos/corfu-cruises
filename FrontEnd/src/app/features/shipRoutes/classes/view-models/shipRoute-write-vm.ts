export class ShipRouteWriteVM {

    constructor(

        public id: number,
        public description: string,
        public fromPort: string,
        public fromTime: string,
        public viaPort: string,
        public viaTime: string,
        public toPort: string,
        public toTime: string,
        public isActive: boolean

    ) { }

}
