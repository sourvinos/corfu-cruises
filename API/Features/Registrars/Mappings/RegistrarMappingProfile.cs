using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Registrars {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<Registrar, RegistrarListDto>();
            CreateMap<Registrar, RegistrarReadDto>();
            CreateMap<Registrar, SimpleResource>()
                .ForMember(r => r.Description, x => x.MapFrom(x => x.Fullname));
            CreateMap<RegistrarWriteDto, Registrar>();
        }

    }

}