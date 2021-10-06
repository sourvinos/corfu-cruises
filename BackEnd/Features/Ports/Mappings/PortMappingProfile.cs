using AutoMapper;

namespace BlueWaterCruises.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, SimpleResource>();
        }

    }

}