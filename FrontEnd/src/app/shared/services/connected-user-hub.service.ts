import * as signalR from '@microsoft/signalr'
import { Injectable } from '@angular/core'
// Custom
import { InteractionService } from './interaction.service'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })

export class ConnectedUserHubService {

    constructor(private interactionService: InteractionService) { }

    private connection = new signalR.HubConnectionBuilder()
        .withUrl(environment.url + '/auth')
        .build()

    public openConnection(): void {
        this.connection.start()
        this.connection.on('BroadcastMessage', (connectedUserCount: any) => {
            this.interactionService.RefreshConnectedUserCount(connectedUserCount)
        })
    }

    public closeConnection(): void {
        this.connection.stop()
        this.connection.on('BroadcastMessage', (connectedUserCount: any) => {
            this.interactionService.RefreshConnectedUserCount(connectedUserCount)
        })
    }

}