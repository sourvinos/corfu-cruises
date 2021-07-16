using AutoMapper;

namespace ShipCruises {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewReadResource>();
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}