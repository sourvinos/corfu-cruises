namespace API.Features.Registrars {

    public class RegistrarListDto {

        public int Id { get; set; }
        public string ShipDescription { get; set; }
        public string Fullname { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}