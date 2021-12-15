using BlueWaterCruises.Features.Ships.Base;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Ships.Registrars {

    public class Registrar {

        // PK
        public int Id { get; set; }
        // Fields
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int ShipId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Ship Ship { get; set; }
        public UserExtended User { get; set; }

    }

}