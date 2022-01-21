namespace API.Features.Destinations {

    public class DestinationWriteResource {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; } = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

    }

}