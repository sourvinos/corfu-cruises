using API.Features.Reservations;
using AutoMapper;

namespace API.Features.PickupPoints {

    public class PickupPointMappingProfile : Profile {

        public PickupPointMappingProfile() {
            // List
            CreateMap<PickupPoint, PickupPointListDto>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(x => x.CoachRoute.Abbreviation));
            // Dropdown
            CreateMap<PickupPoint, PickupPointWithPortDropdownResource>()
                .ForMember(x => x.Id, x => x.MapFrom(x => x.Id))
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Description))
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.Time))
                .ForMember(x => x.Port, x => x.MapFrom(x => new { x.CoachRoute.Port.Id, x.CoachRoute.Port.Description }));
            // Read
            CreateMap<PickupPoint, PickupPointReadDto>()
                .ForMember(x => x.CoachRoute, x => x.MapFrom(x => new { x.CoachRoute.Id, x.CoachRoute.Abbreviation }));
            // Write
            CreateMap<PickupPointWriteDto, PickupPoint>();
        }

    }

}