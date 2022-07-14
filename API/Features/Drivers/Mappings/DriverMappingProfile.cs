using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<Driver, DriverListDto>();
            CreateMap<Driver, DriverReadDto>();
            CreateMap<Driver, SimpleResource>();
            CreateMap<DriverWriteDto, Driver>();
        }

    }

}