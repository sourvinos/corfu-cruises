using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerListResource : SimpleResource {

        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }

    }

}