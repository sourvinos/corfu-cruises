using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.Routes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
            CreateMap<ShipRoute, SimpleResource>();
            CreateMap<ShipRoute, ShipRouteReadResource>();
            CreateMap<ShipRouteWriteResource, ShipRoute>();
        }

    }

}