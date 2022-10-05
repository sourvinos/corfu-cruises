using API.Infrastructure.Classes;

namespace API.Features.Registrars {

    public class RegistrarWriteDto : IEntity {

        public int Id { get; set; }
        public int ShipId { get; set; }
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}