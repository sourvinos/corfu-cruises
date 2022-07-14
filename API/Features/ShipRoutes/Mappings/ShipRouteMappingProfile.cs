using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListDto>();
            CreateMap<ShipRoute, SimpleResource>();
            CreateMap<ShipRoute, ShipRouteReadDto>();
            CreateMap<ShipRouteWriteDto, ShipRoute>();
        }

    }

}