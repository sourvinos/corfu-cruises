using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.ShipCrews {

    public class ShipCrewMappingProfile : Profile {

        public ShipCrewMappingProfile() {
            CreateMap<ShipCrew, ShipCrewListDto>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Birthdate)));
            CreateMap<ShipCrew, ShipCrewReadDto>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Birthdate)))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new { x.Ship.Id, x.Ship.Description }))
                .ForMember(x => x.Nationality, x => x.MapFrom(x => new { x.Nationality.Id, x.Nationality.Description }))
                .ForMember(x => x.Gender, x => x.MapFrom(x => new { x.Gender.Id, x.Gender.Description }));
            CreateMap<ShipCrewWriteDto, ShipCrew>();
            CreateMap<ShipCrew, SimpleResource>()
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Lastname + " " + x.Firstname + " " + DateHelpers.DateTimeToISOString(x.Birthdate)));
            CreateMap<ShipCrewListDto, ShipCrew>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => x.Birthdate));
        }

    }

}