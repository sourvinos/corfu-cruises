export class ManifestCriteriaVM {

    constructor(

        public date: string,
        public destination: { id: number, description: string },
        public port: { id: number, description: string },
        public ship: { id: number, description: string },

    ) { }

}