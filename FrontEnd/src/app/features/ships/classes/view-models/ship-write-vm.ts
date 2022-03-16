export class ShipWriteVM {

    constructor(

        public id: number,
        public shipOwnerId: number,
        public description: string,
        public imo: string,
        public flag: string,
        public registryNo: string,
        public manager: string,
        public agent: string,
        public isActive: boolean

    ) { }

}
