namespace BlueWaterCruises.Features.Ships {

    public class CrewWriteResource {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public int ShipId { get; set; }
        public int GenderId { get; set; }
        public int NationalityId { get; set; }

    }

}