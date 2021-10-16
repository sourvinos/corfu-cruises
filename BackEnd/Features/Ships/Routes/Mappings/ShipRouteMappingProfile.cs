using AutoMapper;

namespace BlueWaterCruises.Features.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
        }

    }

}