using AutoMapper;

namespace CorfuCruises {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewReadResource>();
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}