using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<Destination, DestinationListResource>();
            CreateMap<Destination, DestinationReadResource>();
            CreateMap<Destination, SimpleResource>();
            CreateMap<DestinationWriteResource, Destination>();
        }

    }

}