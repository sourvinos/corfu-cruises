using System.Collections.Generic;

namespace API.Infrastructure.Notifications {

    public static class ConnectedUser {

        public static readonly List<string> Ids = new();

        public static int GetAll() {
            return Ids.Count;
        }

    }

}