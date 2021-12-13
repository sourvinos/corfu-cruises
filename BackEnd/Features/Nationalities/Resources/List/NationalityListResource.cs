using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Nationalities {

    public class NationalityListResource : SimpleResource {

        public string Code { get; set; }
        public bool IsActive { get; set; }

    }

}