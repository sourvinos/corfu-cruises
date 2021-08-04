using AutoMapper;

namespace ShipCruises {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
        }

    }

}