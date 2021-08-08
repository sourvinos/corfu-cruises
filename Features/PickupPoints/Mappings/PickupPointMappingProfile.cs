using AutoMapper;

namespace ShipCruises.PickupPoints {

    public class PickupPointMappingProfile : Profile {

        public PickupPointMappingProfile() {
            CreateMap<PickupPoint, PickupPointReadResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(x => x.Route.Abbreviation));
            CreateMap<PickupPointWriteResource, PickupPoint>();
        }

    }

}