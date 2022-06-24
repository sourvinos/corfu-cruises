using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace API.Infrastructure.SignalR {

    public class ConnectedUserHub : Hub {

        public override Task OnConnectedAsync() {
            ConnectedUser.Ids.Add(Context.ConnectionId);
            Clients.All.SendAsync("BroadcastMessage", ConnectedUser.GetAll());
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception ex) {
            ConnectedUser.Ids.Remove(Context.ConnectionId);
            Clients.All.SendAsync("BroadcastMessage", ConnectedUser.GetAll());
            return base.OnDisconnectedAsync(ex);
        }

    }

}
