using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.ShipOwners {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListDto>();
            CreateMap<ShipOwner, ShipOwnerReadDto>();
            CreateMap<ShipOwner, SimpleResource>();
            CreateMap<ShipOwnerWriteDto, ShipOwner>();
        }

    }

}