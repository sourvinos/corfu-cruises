using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace API.Infrastructure.SignalR {

    public class AnnouncementHub : Hub {

        // "BroadcastData" will be called by the "SendData" method in the hub service (Frontend)
        // "BroadcastMessage" will be caught by the hub service (Frontend)
        public Task BroadcastData(string message) {
            return Clients.All.SendAsync("BroadcastMessage", message);
        }

        public override Task OnConnectedAsync() {
            ConnectedUser.Ids.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception ex) {
            ConnectedUser.Ids.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(ex);
        }

    }

    public static class ConnectedUser {
        public static List<string> Ids = new();

    }

}
