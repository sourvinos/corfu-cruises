using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Ships.Owners {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
            CreateMap<ShipOwner, ShipOwnerReadResource>();
            CreateMap<ShipOwner, SimpleResource>();
            CreateMap<ShipOwnerWriteResource, ShipOwner>();
        }

    }

}