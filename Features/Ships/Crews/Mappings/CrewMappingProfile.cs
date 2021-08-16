using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewListResource>();
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}