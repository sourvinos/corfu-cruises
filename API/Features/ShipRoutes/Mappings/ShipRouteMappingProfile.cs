using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
            CreateMap<ShipRoute, SimpleResource>();
            CreateMap<ShipRoute, ShipRouteReadResource>();
            CreateMap<ShipRouteWriteResource, ShipRoute>();
        }

    }

}