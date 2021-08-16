using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListResource>();
        }

    }

}