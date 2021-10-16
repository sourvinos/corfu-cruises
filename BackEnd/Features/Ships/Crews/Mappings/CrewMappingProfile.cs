using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewListResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Birthdate)));
            CreateMap<Crew, CrewReadResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Birthdate)))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new { x.Ship.Id, x.Ship.Description }))
                .ForMember(x => x.Nationality, x => x.MapFrom(x => new { x.Nationality.Id, x.Nationality.Description }))
                .ForMember(x => x.Gender, x => x.MapFrom(x => new { x.Gender.Id, x.Gender.Description }));
            CreateMap<CrewWriteResource, Crew>();
        }

    }

}