using AutoMapper;
using API.Infrastructure.Classes;

namespace API.Features.Ships.Registrars {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<Registrar, RegistrarListResource>();
            CreateMap<Registrar, RegistrarReadResource>();
            CreateMap<Registrar, SimpleResource>()
                .ForMember(r => r.Description, x => x.MapFrom(x => x.Fullname));
            CreateMap<RegistrarWriteResource, Registrar>();
        }

    }

}