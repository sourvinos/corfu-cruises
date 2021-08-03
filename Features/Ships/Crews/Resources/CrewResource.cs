namespace ShipCruises {

    public class CrewResource {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public ShipResource Ship { get; set; }
        public GenderResource Gender { get; set; }
        public NationalityResource Nationality { get; set; }

    }

}