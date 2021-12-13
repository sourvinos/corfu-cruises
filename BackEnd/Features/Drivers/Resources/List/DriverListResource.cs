using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverListResource : SimpleResource {

        public string Phones { get; set; }
        public bool IsActive { get; set; }

    }

}