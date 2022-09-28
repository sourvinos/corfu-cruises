using AutoMapper;

namespace API.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<DestinationWriteDto, Destination>();
        }

    }

}