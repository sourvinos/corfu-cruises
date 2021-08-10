using AutoMapper;

namespace ShipCruises.PickupPoints {

    public class PickupPointMappingProfile : Profile {

        public PickupPointMappingProfile() {
            CreateMap<PickupPoint, PickupPointReadResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(x => x.Route.Abbreviation));
            CreateMap<PickupPoint, PickupPointDropdownResource>()
                .ForMember(x => x.Id, x => x.MapFrom(x => x.Id))
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Description))
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.Time))
                .ForMember(x => x.PortId, x => x.MapFrom(x => x.Route.PortId));
            CreateMap<PickupPointWriteResource, PickupPoint>();
        }

    }

}