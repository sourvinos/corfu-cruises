using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class ShipMappingProfile : Profile {

        public ShipMappingProfile() {
            CreateMap<Ship, ShipListResource>()
                .ForMember(r => r.OwnerDescription, x => x.MapFrom(x => x.ShipOwner.Description));
            CreateMap<Ship, ShipReadResource>();
            CreateMap<Ship, SimpleResource>();
            CreateMap<ShipWriteResource, Ship>();
        }

    }

}