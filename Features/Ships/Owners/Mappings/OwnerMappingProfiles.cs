using AutoMapper;

namespace ShipCruises.Features.Ships {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListResource>();
        }

    }

}