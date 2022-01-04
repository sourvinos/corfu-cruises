namespace API.Features.Ships.Base {

    public class ShipListResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string OwnerDescription { get; set; }
        public string IMO { get; set; }
        public bool IsActive { get; set; }

    }

}