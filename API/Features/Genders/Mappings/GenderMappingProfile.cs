using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Genders {

    public class GenderMappingProfile : Profile {

        public GenderMappingProfile() {
            CreateMap<Gender, GenderListDto>();
            CreateMap<Gender, GenderReadDto>();
            CreateMap<Gender, SimpleResource>();
            CreateMap<GenderWriteDto, Gender>();
        }

    }

}