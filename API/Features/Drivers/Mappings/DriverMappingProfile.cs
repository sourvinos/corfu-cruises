using AutoMapper;

namespace API.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<DriverWriteDto, Driver>();
        }

    }

}