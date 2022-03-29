export class CoachRouteWriteDTO {

    constructor(

        public id: number,
        public portId: number,
        public abbreviation: string,
        public description: string,
        public hasTransfer: boolean,
        public isActive: boolean,

    ) { }

}
