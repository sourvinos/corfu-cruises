using AutoMapper;

namespace ShipCruises {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<Ship, ShipListResource>()
                .ForMember(r => r.OwnerDescription, x => x.MapFrom(x => x.ShipOwner.Description));
            CreateMap<Ship, ShipReadResource>()
                .ForMember(r => r.ShipOwnerDescription, x => x.MapFrom(x => x.ShipOwner.Description));
            CreateMap<ShipWriteResource, Ship>();
        }

    }

}