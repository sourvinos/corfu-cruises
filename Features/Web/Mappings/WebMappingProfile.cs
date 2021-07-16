using AutoMapper;

namespace ShipCruises {

    public class WebMappingProfile : Profile {

        public WebMappingProfile() {
            CreateMap<WebWriteResource, Reservation>();
        }

    }

}