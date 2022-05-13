namespace API.Features.Ports {

    public class PortReadResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}