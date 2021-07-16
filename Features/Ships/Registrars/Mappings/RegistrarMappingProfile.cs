using AutoMapper;

namespace ShipCruises {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<Registrar, RegistrarListResource>();
            CreateMap<Registrar, RegistrarReadResource>();
            CreateMap<RegistrarWriteResource, Registrar>();
        }

    }

}