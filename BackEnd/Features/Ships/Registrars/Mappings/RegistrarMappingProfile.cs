using AutoMapper;

namespace BlueWaterCruises.Features.Ships {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<Registrar, RegistrarListResource>();
            CreateMap<Registrar, RegistrarReadResource>();
            CreateMap<RegistrarWriteResource, Registrar>();
        }

    }

}