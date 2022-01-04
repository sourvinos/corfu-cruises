using API.Infrastructure.Identity;

namespace API.Features.Ships.Routes {

    public class ShipRoute {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string FromPort { get; set; }
        public string FromTime { get; set; }
        public string ViaPort { get; set; }
        public string ViaTime { get; set; }
        public string ToPort { get; set; }
        public string ToTime { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }

    }

}