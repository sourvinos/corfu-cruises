using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, PortListResource>();
            CreateMap<Port, PortReadResource>();
            CreateMap<Port, SimpleResource>();
            CreateMap<PortWriteResource, Port>();

        }

    }

}