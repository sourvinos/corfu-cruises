export class ShipOwnerWriteVM {

    constructor(

        public id: number,
        public description: string,
        public profession: string,
        public address: string,
        public taxNo: string,
        public city: string,
        public phones: string,
        public email: string,
        public isActive: boolean

    ) { }

}
