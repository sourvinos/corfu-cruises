namespace BlueWaterCruises.Features.Ships {

    public class CrewResource {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public SimpleResource Ship { get; set; }
        public SimpleResource Gender { get; set; }
        public SimpleResource Nationality { get; set; }

    }

}