using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<Destination, DestinationListResource>();
            CreateMap<Destination, DestinationReadResource>();
            CreateMap<Destination, SimpleResource>();
            CreateMap<DestinationWriteResource, Destination>();
        }

    }

}