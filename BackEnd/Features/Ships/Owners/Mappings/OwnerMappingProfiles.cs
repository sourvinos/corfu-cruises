using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
            CreateMap<ShipOwner, ShipOwnerReadResource>();
            CreateMap<ShipOwner, SimpleResource>();
            CreateMap<ShipOwnerWriteResource, ShipOwner>();
        }

    }

}