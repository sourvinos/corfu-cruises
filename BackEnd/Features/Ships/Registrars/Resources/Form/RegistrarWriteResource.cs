using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Ships.Registrars {

    public class RegistrarWriteResource : IEntity {

        public int Id { get; set; }
        public int ShipId { get; set; }
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}