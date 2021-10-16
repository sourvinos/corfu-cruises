namespace BlueWaterCruises.Features.Ships {

    public class ShipOwner : SimpleResource {

        public string Profession { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
        public string City { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

    }

}