using AutoMapper;

namespace BlueWaterCruises.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<Destination, SimpleResource>();
        }

    }

}