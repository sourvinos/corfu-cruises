using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<Destination, DestinationListDto>();
            CreateMap<Destination, DestinationReadDto>();
            CreateMap<Destination, SimpleResource>();
            CreateMap<DestinationWriteDto, Destination>();
        }

    }

}