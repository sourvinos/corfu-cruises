using AutoMapper;

namespace API.Features.Ships {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<ShipWriteDto, Ship>();
        }

    }

}