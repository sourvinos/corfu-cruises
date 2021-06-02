using AutoMapper;

namespace CorfuCruises {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
        }

    }

}