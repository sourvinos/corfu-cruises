using BlueWaterCruises.Features.Routes;

namespace BlueWaterCruises.Features.Ships {

    public class RegistrarReadResource {

        public int Id { get; set; }
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public SimpleResource Ship { get; set; }

    }

}