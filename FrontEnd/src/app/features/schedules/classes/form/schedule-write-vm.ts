export class ScheduleWriteVM {

    constructor(

        public id: number,
        public destinationId: number,
        public portId: number,
        public date: string,
        public maxPassengers: number,
        public isActive: boolean

    ) { }

}