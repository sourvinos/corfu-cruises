using AutoMapper;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointMappingProfile : Profile {

        public PickupPointMappingProfile() {
            // List
            CreateMap<PickupPoint, PickupPointListResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(x => x.Route.Abbreviation));
            // Dropdown
            CreateMap<PickupPoint, PickupPointWithPortDropdownResource>()
                .ForMember(x => x.Id, x => x.MapFrom(x => x.Id))
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Description))
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.Time))
                .ForMember(x => x.Port, x => x.MapFrom(x => new { x.Route.Port.Id, x.Route.Port.Description }));
            // Read
            CreateMap<PickupPoint, PickupPointReadResource>()
                .ForMember(x => x.Route, x => x.MapFrom(x => new { x.Route.Id, x.Route.Abbreviation }));
            // Write
            CreateMap<PickupPointWriteResource, PickupPoint>();
        }

    }

}