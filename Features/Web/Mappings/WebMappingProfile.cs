using AutoMapper;

namespace CorfuCruises {

    public class WebMappingProfile : Profile {

        public WebMappingProfile() {
            CreateMap<WebWriteResource, Reservation>();
        }

    }

}