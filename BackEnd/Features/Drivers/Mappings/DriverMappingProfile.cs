using AutoMapper;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<Driver, SimpleResource>();
        }

    }

}