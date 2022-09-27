using AutoMapper;

namespace API.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, PortListVM>();
            CreateMap<Port, PortReadDto>();
            CreateMap<Port, PortActiveVM>();
            CreateMap<PortWriteDto, Port>();
        }

    }

}