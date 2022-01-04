namespace API.Features.Manifest {

    public class ManifestCrewResource {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }

        public string GenderDescription { get; set; }
        public string NationalityDescription { get; set; }
        public string OccupantDescription { get; set; }

    }

}