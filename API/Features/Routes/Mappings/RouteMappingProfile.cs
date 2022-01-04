using AutoMapper;

namespace API.Features.Routes {

    public class RouteMappingProfile : Profile {

        public RouteMappingProfile() {
            CreateMap<RouteWriteResource, Route>();
            CreateMap<Route, RouteWithPortListResource>();
        }

    }

}