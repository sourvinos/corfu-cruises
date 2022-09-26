using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Ships {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<Ship, SimpleResource>();
            CreateMap<Ship, ShipReadDto>();
            CreateMap<ShipWriteDto, Ship>();
        }

    }

}