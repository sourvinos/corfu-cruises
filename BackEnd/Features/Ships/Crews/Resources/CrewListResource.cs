namespace BlueWaterCruises.Features.Ships {

    public class CrewListResource {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string ShipDescription { get; set; }
        public bool IsActive { get; set; }

    }

}