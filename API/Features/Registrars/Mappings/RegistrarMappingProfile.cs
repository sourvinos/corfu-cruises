using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Registrars {

    public class RegistrarMappingProfile : Profile {

        public RegistrarMappingProfile() {
            CreateMap<RegistrarWriteDto, Registrar>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}