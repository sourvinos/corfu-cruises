using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<Driver, DriverListResource>();
            CreateMap<Driver, DriverReadResource>();
            CreateMap<Driver, SimpleResource>();
            CreateMap<DriverWriteResource, Driver>();
        }

    }

}