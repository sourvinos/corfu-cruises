using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, PortListDto>();
            CreateMap<Port, PortReadDto>();
            CreateMap<Port, SimpleResource>();
            CreateMap<PortWriteDto, Port>();

        }

    }

}