export class ManifestShipRouteVM {

    constructor(

        public description: string,
        public fromPort: string,
        public fromTime: string,
        public viaPort: string,
        public viaTime: string,
        public toPort: string,
        public toTime: string

    ) { }

}
