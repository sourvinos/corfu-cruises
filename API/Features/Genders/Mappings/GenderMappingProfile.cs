using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Genders {

    public class GenderMappingProfile : Profile {

        public GenderMappingProfile() {
            CreateMap<Gender, GenderListResource>();
            CreateMap<Gender, GenderReadResource>();
            CreateMap<Gender, SimpleResource>();
            CreateMap<GenderWriteResource, Gender>();
        }

    }

}