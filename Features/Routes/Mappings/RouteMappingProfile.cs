using AutoMapper;

namespace BlueWaterCruises.Features.Routes {

    public class RouteMappingProfile : Profile {

        public RouteMappingProfile() {
            CreateMap<RouteWriteResource, Route>();
        }

    }

}