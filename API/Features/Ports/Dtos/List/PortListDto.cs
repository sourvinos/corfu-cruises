namespace API.Features.Ports {

    public class PortListDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}