using AutoMapper;

namespace ShipCruises {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewListResource>();
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}