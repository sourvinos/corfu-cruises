using AutoMapper;

namespace API.Features.CoachRoutes {

    public class RouteMappingProfile : Profile {

        public RouteMappingProfile() {
            CreateMap<CoachRouteWriteDto, CoachRoute>();
            CreateMap<CoachRoute, CoachRouteActiveForDropdownVM>();
            CreateMap<CoachRoute, CoachRouteReadDto>();
        }

    }

}