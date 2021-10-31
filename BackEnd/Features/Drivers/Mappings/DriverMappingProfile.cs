using AutoMapper;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<Driver, DriverListResource>();
            CreateMap<Driver, DriverReadResource>();
            CreateMap<Driver, SimpleResource>();
            CreateMap<DriverWriteResource, Driver>();
        }

    }

}