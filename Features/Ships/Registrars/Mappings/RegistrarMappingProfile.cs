using AutoMapper;

namespace CorfuCruises {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<Registrar, RegistrarListResource>();
            CreateMap<Registrar, RegistrarReadResource>();
            CreateMap<RegistrarWriteResource, Registrar>();
        }

    }

}