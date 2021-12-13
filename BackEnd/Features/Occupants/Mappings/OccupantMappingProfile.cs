using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Occupants {

    public class OccupantMappingProfile : Profile {

        public OccupantMappingProfile() {
            CreateMap<Occupant, OccupantListResource>();
            CreateMap<Occupant, OccupantReadResource>();
            CreateMap<Occupant, SimpleResource>();
            CreateMap<OccupantWriteResource, Occupant>();
        }

    }

}