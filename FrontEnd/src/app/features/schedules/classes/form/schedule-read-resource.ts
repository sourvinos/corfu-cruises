export class ScheduleReadResource {

    id: number
    date: string
    destination: { id: number, description: string }
    port: { id: number, description: string }
    maxPersons: number
    isActive: boolean
    userId: string

}