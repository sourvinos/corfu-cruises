using API.Features.Ships.Base;
using API.Infrastructure.Identity;

namespace API.Features.Ships.Registrars {

    public class Registrar {

        // PK
        public int Id { get; set; }
        // FKs
        public int ShipId { get; set; }
        // Fields
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Ship Ship { get; set; }
        public UserExtended User { get; set; }

    }

}