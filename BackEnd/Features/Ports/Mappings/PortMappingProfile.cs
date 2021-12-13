using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, PortListResource>();
            CreateMap<Port, PortReadResource>();
            CreateMap<Port, SimpleResource>();
            CreateMap<PortWriteResource, Port>();

        }

    }

}