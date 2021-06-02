using AutoMapper;

namespace CorfuCruises {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<Ship, ShipReadResource>()
                .ForMember(rr => rr.ShipOwnerDescription, x => x.MapFrom(x => x.ShipOwner.Description));
            CreateMap<ShipWriteResource, Ship>();
        }

    }

}