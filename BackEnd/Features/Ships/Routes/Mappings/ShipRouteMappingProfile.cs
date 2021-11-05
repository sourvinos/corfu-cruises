using AutoMapper;

namespace BlueWaterCruises.Features.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
            CreateMap<ShipRoute, SimpleResource>();
            CreateMap<ShipRoute, ShipRouteReadResource>();
            CreateMap<ShipRouteWriteResource, ShipRoute>();
        }

    }

}