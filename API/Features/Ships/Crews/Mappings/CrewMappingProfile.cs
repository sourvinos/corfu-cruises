using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using AutoMapper;

namespace API.Features.Ships.Crews {

    public class CrewMappingProfile : Profile {

        public CrewMappingProfile() {
            CreateMap<Crew, CrewListResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Birthdate)));
            CreateMap<Crew, CrewReadResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Birthdate)))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new { x.Ship.Id, x.Ship.Description }))
                .ForMember(x => x.Nationality, x => x.MapFrom(x => new { x.Nationality.Id, x.Nationality.Description }))
                .ForMember(x => x.Gender, x => x.MapFrom(x => new { x.Gender.Id, x.Gender.Description }));
            CreateMap<Crew, SimpleResource>()
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Lastname + " " + x.Firstname + " " + DateHelpers.DateTimeToISOString(x.Birthdate)));
            CreateMap<CrewWriteResource, Crew>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => x.Birthdate));
        }

    }

}