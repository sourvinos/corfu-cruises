using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Ships {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<Ship, ShipListDto>()
                .ForMember(r => r.OwnerDescription, x => x.MapFrom(x => x.ShipOwner.Description));
            CreateMap<Ship, ShipReadDto>();
            CreateMap<Ship, SimpleResource>();
            CreateMap<ShipWriteDto, Ship>();
        }

    }

}