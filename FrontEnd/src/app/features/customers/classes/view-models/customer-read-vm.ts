export class CustomerReadVM {

    constructor(

        public id: number,
        public description: string,
        public profession: string,
        public address: string,
        public phones: string,
        public personInCharge: string,
        public email: string,
        public isActive: boolean

    ) { }

}
