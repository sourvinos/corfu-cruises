using AutoMapper;

namespace ShipCruises.Features.Ships {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewListResource>();
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}