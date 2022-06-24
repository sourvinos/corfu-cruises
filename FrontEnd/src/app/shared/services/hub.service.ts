import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'

@Injectable({ providedIn: 'root' })

export class HubService {

    private connection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:5001/customers')
        .build()

    public startConnection(): void {
        this.connection.start()
        this.connection.on('BroadcastMessage', (data: any) => {
            console.log('OK: ', data)
        })
    }

    public closeConnection(): void {
        this.connection.stop()
    }

    public SendData(message: string): void {
        this.connection.invoke('BroadcastData', message)
    }

}