using AutoMapper;

namespace API.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<PortWriteDto, Port>();
        }

    }

}