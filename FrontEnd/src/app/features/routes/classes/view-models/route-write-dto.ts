export class RouteWriteDTO {

    constructor(

        public id: number,
        public portId: number,
        public abbreviation: string,
        public description: string,
        public isActive: boolean,
        public hasTransfer: boolean

    ) { }

}
