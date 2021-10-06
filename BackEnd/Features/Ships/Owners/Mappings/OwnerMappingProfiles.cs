using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
        }

    }

}