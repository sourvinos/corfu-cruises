using System.Collections.Generic;
using BlueWaterCruises.Features.Ships.Base;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Ships.Owners {

    public class ShipOwner {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Profession { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
        public string City { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public AppUser User { get; set; }
        public List<Ship> Ships { get; set; }

    }

}