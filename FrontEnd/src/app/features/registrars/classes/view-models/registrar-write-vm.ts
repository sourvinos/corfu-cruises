export class RegistrarWriteVM {

    constructor(

        public id: number,
        public shipId: number,
        public fullname: string,
        public phones: string,
        public email: string,
        public fax: string,
        public address: string,
        public isPrimary: boolean,
        public isActive: boolean

    ) { }

}
