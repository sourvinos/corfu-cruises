using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
            CreateMap<ShipRoute, SimpleResource>();
            CreateMap<ShipRoute, ShipRouteReadResource>();
            CreateMap<ShipRouteWriteResource, ShipRoute>();
        }

    }

}