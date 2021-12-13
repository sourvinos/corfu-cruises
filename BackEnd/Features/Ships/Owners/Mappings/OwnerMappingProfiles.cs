using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.Owners {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
            CreateMap<ShipOwner, ShipOwnerReadResource>();
            CreateMap<ShipOwner, SimpleResource>();
            CreateMap<ShipOwnerWriteResource, ShipOwner>();
        }

    }

}